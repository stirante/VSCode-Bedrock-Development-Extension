import { PackType } from "bc-minecraft-bedrock-project";
import { CompletionItemKind, Position } from "vscode-languageserver-types";
import { SimpleContext } from "../../Code/SimpleContext";
import { CompletionBuilder } from "../../Completion/Builder";
import { Languages } from "../../Constants";


import * as Query from "./Query/Completion";
import * as Math from "./Math/Completion";
import * as Temps from "./Temps/Completion";
import * as Variables from "./Variables/Completion";
import * as Geometry from "./Geometry/Completion";
import * as Texture from "./Texture/Completion";

import { GetPreviousWord, IsMolang } from './Functions';
import * as BehaviorPack from '../BehaviorPack/include';
import * as ResourcePack from '../ResourcePack/include';

export function ProvideDocCompletion(context: SimpleContext<CompletionBuilder>, pos: Position): void {
  const doc = context.doc;
  const line = doc.getLine(pos.line);
  const cursor = doc.offsetAt(pos);

  return ProvideCompletion(line, cursor, context);
}

/**
 *
 * @param line
 * @param cursor
 * @param doc
 * @param receiver
 * @returns
 */
export function ProvideCompletion(line: string, cursor: number, context: SimpleContext<CompletionBuilder>): void {
  const Word = GetPreviousWord(line, cursor).toLowerCase();

  switch (Word) {
    case "animation":
      return PrefixedData(ResourcePack.Animations.ProvideCompletion, BehaviorPack.Animations.ProvideCompletion, context);

    case "controller":
      return PrefixedData(
        (context) => {
          ResourcePack.AnimationControllers.ProvideCompletion(context);
          ResourcePack.RenderControllers.ProvideCompletion(context);
        },
        BehaviorPack.AnimationControllers.ProvideCompletion,
        context
      );

    case "q":
    case "query":
      return Query.ProvideCompletion(context);

    case "m":
    case "math":
      return Math.ProvideCompletion(context);

    case "geometry":
      return Geometry.ProvideCompletion(context);

    //TODO material

    case "v":
    case "variable":
      return Variables.ProvideCompletion(context);

    case "t":
    case "texture":
      return Texture.ProvideCompletion(context);

    case "temp":
      return Temps.ProvideCompletion(context);
  }

  const doc = context.doc;
  const receiver = context.receiver;

  if (IsMolang(line) || doc.languageId == Languages.McMolangIdentifier) {
    receiver.Add("query", "", CompletionItemKind.Class);
    receiver.Add("variable", "", CompletionItemKind.Variable);
    receiver.Add("math", "", CompletionItemKind.Class);
    receiver.Add("texture", "", CompletionItemKind.Property);
    receiver.Add("material", "", CompletionItemKind.Property);
    receiver.Add("geometry", "", CompletionItemKind.Property);
    receiver.Add("temp", "", CompletionItemKind.Variable);
    receiver.Add("this", "", CompletionItemKind.Struct);

    Query.ProvideCompletion(context);
    Math.ProvideCompletion(context);
  }
}

type functioncall = (context: SimpleContext<CompletionBuilder>) => void;

/**
 *
 * @param RP
 * @param BP
 * @param context
 */
function PrefixedData(RP: functioncall, BP: functioncall, context: SimpleContext<CompletionBuilder>): void {
  const type = PackType.detect(context.doc.uri);

  const old_OnNewItem = context.receiver.OnNewItem;

  //register new OnNewItem event to prune ids
  context.receiver.OnNewItem = (item) => {
    item.label = IDRemoveFirst(item.label);

    if (old_OnNewItem) old_OnNewItem(item);
  };

  switch (type) {
    case PackType.behavior_pack:
      BP(context);
      break;

    case PackType.resource_pack:
      RP(context);
      break;
  }

  //Restore old OnNewItem
  context.receiver.OnNewItem = old_OnNewItem;
}

/**
 *
 * @param id
 * @returns
 */
function IDRemoveFirst(id: string): string {
  const index = id.indexOf(".");

  if (index > -1) return id.substring(index + 1);

  return id;
}
