import { Context } from "./Context";
import { create_language_files } from "./language";
import { TemplateBuilder } from "./Builder";
import { Templates } from "./Templates";
import { TextEditBuilder } from "../Language";
import { Vscode } from "../../Code";

import * as path from "path";

/**
 *
 * @param ID
 * @param context
 * @param Builder
 */
export async function create_world_project(ID: string, context: Context, Builder: TemplateBuilder): Promise<void> {
  const Folder = Vscode.join(context.WorkSpace(), "world");

  const NewContext = {
    WorkSpace: () => context.WorkSpace(),
    BehaviorPack: () => Vscode.join(Folder, "behavior_packs", ID + "-BP"),
    ResourcePack: () => Vscode.join(Folder, "resource_packs", ID + "-RP"),
    WorldFolder: () => Folder,
  };

  await Promise.all([
    Templates.create("world-manifest", NewContext.WorldFolder()),
    Templates.create("behavior-manifest", NewContext.BehaviorPack()),
    Templates.create("resource-manifest", NewContext.ResourcePack()),
  ]);

  //create world manifest
  create_language_files(NewContext.BehaviorPack(), Builder, languageBP);
  create_language_files(NewContext.ResourcePack(), Builder, languageRP);
  create_language_files(NewContext.WorldFolder(), Builder, languageWP);
}

/**
 *
 * @param ID
 * @param context
 * @param Builder
 */
export async function create_behaviorpack(ID: string, context: Context, Builder: TemplateBuilder): Promise<void> {
  const Folder = path.join(context.WorkSpace(), ID + "-BP");

  const NewContext = {
    WorkSpace: () => context.WorkSpace(),
    BehaviorPack: () => Folder,
    ResourcePack: () => Folder,
    WorldFolder: context.WorldFolder,
  };

  await Templates.create("behavior-manifest", NewContext.BehaviorPack());
  create_language_files(Folder, Builder, languageBP);
}

/**
 *
 * @param ID
 * @param context
 * @param Builder
 */
export async function create_resourcepack(ID: string, context: Context, Builder: TemplateBuilder): Promise<void> {
  const Folder = path.join(context.WorkSpace(), ID + "-RP");

  const NewContext = {
    WorkSpace: context.WorkSpace,
    BehaviorPack: () => Folder,
    ResourcePack: () => Folder,
    WorldFolder: context.WorldFolder,
  };

  await Templates.create("resource-manifest", NewContext.ResourcePack());
  create_language_files(Folder, Builder, languageRP);
}

function languageWP(text: TextEditBuilder): void {
  text.Add("pack.name", "Example wp pack name");
  text.Add("pack.description", "The text that describes this world example pack");
}

function languageBP(text: TextEditBuilder): void {
  text.Add("pack.name", "Example wp pack name");
  text.Add("pack.description", "The behaviors for the project");
}

function languageRP(text: TextEditBuilder): void {
  text.Add("pack.name", "Example resource pack name");
  text.Add("pack.description", "The resources for the project");
}
