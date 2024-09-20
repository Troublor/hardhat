import type { Remapping } from "./types.js";
import type { Cursor } from "@nomicfoundation/slang/cursor/index.js";
import type { cursor } from "@nomicfoundation/slang/napi-bindings/generated/index.js";

import { assertHardhatInvariant } from "@ignored/hardhat-vnext-errors";
import BitSet from "@marsraptor/bitset";
import { NodeType } from "@nomicfoundation/slang/cst/index.js";
import {
  NonterminalKind,
  TerminalKind,
} from "@nomicfoundation/slang/kinds/index.js";
import { Language } from "@nomicfoundation/slang/language/index.js";
import { Query } from "@nomicfoundation/slang/query/index.js";

// Maybe all these top level elements should be in the Project instance, to avoid startup cost?

const supportedVersions = Language.supportedVersions();
const mostRecentVersion = supportedVersions[supportedVersions.length - 1];
const language = new Language(mostRecentVersion);

const importQuery = `(
       [PathImport @path path: [_]]
     | [NamedImport @path path: [_]]
     | [ImportDeconstruction @path path: [_]]
     )`;
const pragmaQuery = `[VersionPragma [VersionExpressionSets (@versionExpression [VersionExpression])+]]`;
const queries = [importQuery, pragmaQuery].map(Query.parse);

type SourceName = string;
type Version = string; // TODO: find something better, from semver most likely

export class ProjectDefinition {
  constructor(
    public readonly roots: SourceName[],
    public readonly remappings: Remapping[],
    public readonly allowableVersions: Version[] = supportedVersions, // ... but if this is lazy then we can't use it in the constructor
  ) {}
}

export interface Root {
  dependencies: Set<SourceName>;
  // undefined if we couldn't determine the best version
  bestVersion?: Version;
}

interface Source {
  dependencies: Set<SourceName>;
  dependents: Set<SourceName>;
  compatibleVersions: BitSet.default;
}

export abstract class ProjectModel {
  #definition: ProjectDefinition;

  readonly #roots = new Map<SourceName, Root>();
  readonly #sources = new Map<SourceName, Source>();

  constructor(definition: ProjectDefinition) {
    this.#definition = definition;
  }

  public updateDefinition(definition: ProjectDefinition): void {
    this.#definition = definition;
    // TODO: do minimum invalidation
    this.#roots.clear();
    this.#sources.clear();
  }

  public sourceDidChange(_sourceName: SourceName): void {
    // TODO: do minimum invalidation
    this.#roots.clear();
    this.#sources.clear();
  }

  public getRoot(rootSourceName: SourceName): Root {
    if (!this.#roots.has(rootSourceName)) {
      const unvisitedSourceNames = new Array<string>();

      const ensureSourceNameIsProcessed = (sourceName: SourceName) => {
        if (!this.#sources.has(sourceName)) {
          this.#sources.set(sourceName, {
            dependencies: new Set(),
            dependents: new Set(),
            compatibleVersions: new BitSet.default().flip(),
          });
          unvisitedSourceNames.push(sourceName);
        }
      };

      {
        // Add the root and it's dependencies to the graph of sources

        ensureSourceNameIsProcessed(rootSourceName);

        let sourceName;
        while ((sourceName = unvisitedSourceNames.pop()) !== undefined) {
          const source = this.#sources.get(sourceName);
          assertHardhatInvariant(
            source !== undefined,
            "We have already added this source to the graph",
          );

          const contents = this.getSourceContent(sourceName);
          const parseOutput = language.parse(
            NonterminalKind.SourceUnit,
            contents,
          );
          const matches = parseOutput.createTreeCursor().query(queries);

          let match;
          while ((match = matches.next()) !== null) {
            if (match.queryNumber === 0) {
              const importSourceName = this.resolveImport(
                sourceName,
                match.captures.path[0].node.toString(),
              );
              // TODO: what if the import doesn't exist?
              source.dependencies.add(importSourceName);
              ensureSourceNameIsProcessed(importSourceName);
            } else {
              // VersionExpressionSets are the disjunction of VersionExpression(s)

              // Filter out any parse errors
              const compatibleVersions = match.captures.versionExpression
                .map(bitsetFromVersionExpression)
                .filter((v) => v !== undefined);

              // No point adding a constraint that was nothing but parse errors
              if (compatibleVersions.length !== 0) {
                source.compatibleVersions = source.compatibleVersions.and(
                  compatibleVersions.reduce((a, b) => a.or(b)),
                );
              }
            }
          }
        }
      }

      {
        // Compute the transitive dependencies and version constraints of the root

        const dependencies = new Set<string>();
        const compatibleVersions = new BitSet.default(
          supportedVersions.length,
        ).flip();

        const visit = (sourceName: SourceName) => {
          const source = this.#sources.get(sourceName);
          assertHardhatInvariant(
            source !== undefined,
            "We have already added this source to the graph",
          );
          for (const dependency of source.dependencies) {
            if (!dependencies.has(dependency)) {
              dependencies.add(dependency);
              visit(dependency);
            }
            compatibleVersions.and(source.compatibleVersions);
          }
        };

        visit(rootSourceName);

        // Determine the best version from the allowable versions that satisfies the transitive constraints

        let bestVersion;
        for (let i = supportedVersions.length - 1; i >= 0; i--) {
          if (compatibleVersions.get(i) === 1) {
            const candidateVersion = supportedVersions[i];
            if (this.#definition.allowableVersions.includes(candidateVersion)) {
              bestVersion = candidateVersion;
              break;
            }
          }
        }

        // if bestVersion is undefined, the versions constraints are unsatisfiable

        this.#roots.set(rootSourceName, { dependencies, bestVersion });
      }
    }

    const root = this.#roots.get(rootSourceName);
    assertHardhatInvariant(
      root !== undefined,
      "We have already added this root to the set of roots",
    );
    return root;
  }

  public abstract getSourceContent(_sourceName: SourceName): string;
  public abstract resolveImport(
    _context: SourceName,
    _importPath: string,
  ): SourceName;
}

const versionRangeQuery = `[VersionRange [@start start: [VersionLiteral] @end end: [VersionLiteral]]]`;
const versionTermQuery = `[VersionTerm  [operator: [VersionOperator @operator [_]] @literal literal: [VersionLiteral]]]`;
const versionExpressionQueries = [versionRangeQuery, versionTermQuery].map(
  Query.parse,
);

// Parse error => undefined
function bitsetFromVersionExpression(expr: Cursor): BitSet.default | undefined {
  const matches = expr.spawn().query(versionExpressionQueries);
  const match = matches.next();
  if (match === null) return undefined;

  if (match.queryNumber === 0) {
    // VersionRange

    const start = versionIndexFromLiteral(match.captures.start[0]);
    if (start === undefined) return undefined;

    const end = versionIndexFromLiteral(match.captures.end[0]);
    if (end === undefined) return undefined;

    // TODO: compute bitset
  } else {
    // VersionTerm

    const literal = versionIndexFromLiteral(match.captures.literal[0]);
    if (literal === undefined) return undefined;

    const operator = match.captures.operator[0].node();
    // TODO: use assertion functions from v1 api
    assertHardhatInvariant(
      operator.type === NodeType.Terminal,
      "Expected operator to be a terminal",
    );

    // TODO: compute bitset
    // TODO: Invalid operator applications i.e. "< 0.4.11" should be caught by the parser
    switch (operator.kind) {
      case TerminalKind.Caret:
        break;
      case TerminalKind.Tilde:
        break;
      case TerminalKind.Equal:
        break;
      case TerminalKind.LessThan:
        break;
      case TerminalKind.GreaterThan:
        break;
      case TerminalKind.LessThanEqual:
        break;
      case TerminalKind.GreaterThanEqual:
        break;
      default:
        assertHardhatInvariant(
          false,
          `Unexpected operator ${operator.toJSON()}`,
        );
    }
  }
}

// Parse error, or invalid version => undefined
// TODO: Invalid versions should be caught by the parser
function versionIndexFromLiteral(_literal: cursor.Cursor): number | undefined {
  throw new Error("Function not implemented.");
}
