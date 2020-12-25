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
import { Range } from 'vscode-languageserver';
import { LocationWord } from '../../../code/words/include';


export interface ISelector {
	Type: LocationWord;
	Parameters: IParameter[];
}

export namespace ISelector {

	export function is(value: any): value is ISelector {
		if (value) {
			if (value.Type && value.Parameters) {
				if (value.Type.text && value.Type.range, value.uri) {
					if (Array.isArray(value.Parameters)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	export function Parse(text: LocationWord): ISelector {

	}
}

export interface IParameter {
	Range: Range;
	Name: string;
	Value: string;
}

export namespace IParameter {
	export function is(value: any): value is IParameter {
		if (value) {
			if (value.Name && value.Value && value.Range) {
				if (Range.is(value.Range)) {
					return true;
				}
			}
		}

		return false;
	}

	export function Parse(text: string, startIndex: number, Line: number): IParameter | IScoreParameter {
		let Index = text.indexOf('=');

		if (Index < 0)
			throw new Error('index cannot be lower then 0');

		let Range: Range = { start: { character: startIndex, line: Line }, end: { character: startIndex + text.length, line: Line } };
		let Name = text.substring(0, Index);
		let Value = text.substring(Index, text.length);

		if (Name == "scores") {

			let Out: IScoreParameter = {
				Name: Name,
				Range: Range,
				
			}


			return Out;
		}
		else {

		}
	}
}


export interface IScoreParameter extends IParameter {
	Scores: IParameter[];
}

export namespace IScoreParameter {
	export function is(value: any): value is IScoreParameter {
		if (value) {
			if (value.Name && value.Value && value.Range && value.Scores) {
				if (Range.is(value.Range) && Array.isArray(value.Scores)) {
					return true;
				}
			}
		}

		return false;
	}
}


