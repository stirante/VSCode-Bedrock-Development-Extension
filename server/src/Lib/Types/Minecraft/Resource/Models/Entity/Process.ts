/*BSD 3-Clause License

Copyright (c) 2020, Blockception Ltd
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
	 list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
	 this list of conditions and the following disclaimer in the documentation
	 and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
	 contributors may be used to endorse or promote products derived from
	 this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
import { TextDocument } from "vscode-languageserver-textdocument";
import { Location, Range } from "vscode-languageserver-types";
import { JsonDocument } from "../../../../../Code/Json/Json Document";
import { Database } from "../../../../../Database/Database";
import { DataReference } from "../../../../../Database/Types/Reference";
import { ModelEntity } from "./ModelEntity";

export function Process(doc: TextDocument): void {
  let JDoc = new JsonDocument(doc);
  let Data = JDoc.CastTo<ModelEntity>();

  if (Data) {
    if (Data.format_version === "1.8.0") {
      let keys = Object.keys(Data);

      for (let k in keys) {
        if (k !== "format_version") {
          let range = JDoc.RangeOf(k) ?? Range.create(0, 0, 0, 0);

          Database.Data.Resourcepack.Models.Set(new DataReference(k, Location.create(JDoc.doc.uri, range)));
        }
      }
    } else {
      for (let Geo of Data["minecraft:geometry"]) {
        let id = Geo.description.identifier;
        let range = JDoc.RangeOf(id) ?? Range.create(0, 0, 0, 0);

        Database.Data.Resourcepack.Models.Set(new DataReference(id, Location.create(JDoc.doc.uri, range)));
      }
    }
  }
}