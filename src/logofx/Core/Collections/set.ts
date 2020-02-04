import * as util from './collection-util';
import * as arrays from './arrays';
import { Dictionary } from './dictionary';

/**
 * Represents the set.
 */
export default class Set<T> {

    /**
     * Dictionary key and value holds the elements in the set.
     */
    protected dictionary: Dictionary<T, any>;

    /**
     * Creates an empty set.
     * <p>A set is a data structure that contains no duplicate items.</p>
     * <p>If the inserted elements are custom objects a function
     * which converts elements to strings must be provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     *
     * @param toStringFunction optional function used
     * to convert elements to strings. If the elements aren't strings or if toString()
     * is not appropriate, a custom function which receives an object and returns a
     * unique string must be provided.
     */
    constructor(toStringFunction?: (item: T) => string) {
        this.dictionary = new Dictionary<T, any>(toStringFunction);
    }

    /**
     * Returns true if this set contains the specified element.
     * @param element element to search for.
     * @return true if this set contains the specified element,
     * false otherwise.
     */
    public contains(element: T): boolean {
        return this.dictionary.containsKey(element);
    }

    /**
     * Adds the specified element to this set if it is not already present.
     * @param  element the element to insert.
     * @return  true if this set did not already contain the specified element.
     */
    public add(element: T): boolean {
        if (this.contains(element) || util.isUndefined(element)) {
            return false;
        } else {
            this.dictionary.setValue(element, element);
            return true;
        }
    }

    /**
     * Performs an intersection between this and another set.
     * Removes all values that are not present this set and the given set.
     * @param  otherSet other set.
     */
    public intersection(otherSet: Set<T>): void {
        this.forEach((element: T): boolean => {
            if (!otherSet.contains(element)) {
                this.remove(element);
            }
            return true;
        });
    }

    /**
     * Performs a union between this and another set.
     * Adds all values from the given set to this set.
     * @param  otherSet other set.
     */
    public union(otherSet: Set<T>): void {
        otherSet.forEach(function(element: T): boolean {
            this.add(element);
            return true;
        });
    }

    /**
     * Performs a difference between this and another set.
     * Removes from this set all the values that are present in the given set.
     * @param  otherSet other set.
     */
    public difference(otherSet: Set<T>): void {
        otherSet.forEach(function(element: T): boolean {
            this.remove(element);
            return true;
        });
    }

    /**
     * Checks whether the given set contains all the elements in this set.
     * @param  otherSet other set.
     * @return  true if this set is a subset of the given set.
     */
    public isSubsetOf(otherSet: Set<T>): boolean {

        if (this.size() > otherSet.size()) {
            return false;
        }

        let isSub = true;
        this.forEach((element) => {
            if (!otherSet.contains(element)) {
                isSub = false;
                return false;
            }
            return true;
        });
        return isSub;
    }

    /**
     * Removes the specified element from this set if it is present.
     * @return  true if this set contained the specified element.
     */
    public remove(element: T): boolean {
        if (!this.contains(element)) {
            return false;
        } else {
            this.dictionary.remove(element);
            return true;
        }
    }

    /**
     * Executes the provided function once for each element
     * present in this set.
     * @param  callback function to execute, it is
     * invoked with one arguments: the element. To break the iteration you can
     * optionally return false.
     */
    public forEach(callback: util.ILoopFunction<T>): void {
        this.dictionary.forEach((k, v) => {
            return callback(v);
        });
    }

    /**
     * Returns an array containing all of the elements in this set in arbitrary order.
     * @return  an array containing all of the elements in this set.
     */
    public toArray(): T[] {
        return this.dictionary.values();
    }

    /**
     * Returns true if this set contains no elements.
     * @return  true if this set contains no elements.
     */
    public isEmpty(): boolean {
        return this.dictionary.isEmpty();
    }

    /**
     * Returns the number of elements in this set.
     * @return  the number of elements in this set.
     */
    public size(): number {
        return this.dictionary.size();
    }

    /**
     * Removes all of the elements from this set.
     */
    public clear(): void {
        this.dictionary.clear();
    }

    /*
    * Provides a string representation for display
    */
    public toString(): string {
        return arrays.toString(this.toArray());
    }
}// end of Set
