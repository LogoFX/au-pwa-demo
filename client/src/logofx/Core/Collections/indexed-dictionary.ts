import { Dictionary } from "./dictionary";

/**
 * Represents indexed dictionary collection. The class isn't implemented properly.
 */
export class IndexedDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {

    public get replaceDuplicateKeys(): boolean {
        return this._replaceDuplicateKeys;
    }

    public set replaceDuplicateKeys(value: boolean) {
        this._replaceDuplicateKeys = value;
    }

    public get throwErrorOnInvalidRemove(): boolean {
        return this._throwErrorOnInvalidRemove;
    }

    public set throwErrorOnInvalidRemove(value: boolean) {
        this._throwErrorOnInvalidRemove = value;
    }

    protected internalKeys: Set<TKey> = new Set<TKey>();

    private _replaceDuplicateKeys: boolean;
    private _throwErrorOnInvalidRemove: boolean;

    constructor () {
        super();
    }

    /// <summary>
    /// Makes sure int is not used as dictionary key:
    /// </summary>
    // private validateKeyType(): void    {
    //     const x: TKey = new (): TKey;

    //     if (typeof x === "number")
    //     {
    //         throw new Error("Key of type int is not supported.");
    //     }
    // }

    public add(key: TKey, value: TValue): void { /* */  }

    public addAt(index: number, key: TKey, value: TValue): void { /* */ }

    public contains(key: TKey): boolean {
        return super.containsKey(this.transformKey(key));
    }

    protected transformKey(key: TKey): TKey {
        return key;
    }

}
