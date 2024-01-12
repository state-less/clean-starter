import { atom, useAtom } from 'jotai';
import {
    Atom,
    PrimitiveAtom,
    SetStateAction,
    WritableAtom,
} from 'jotai/vanilla';

const atoms: Record<string, PrimitiveAtom<unknown>> = {};

const getInitialValue = (key, initialValue, { cookie }) => {
    try {
        const item = window.localStorage.getItem(key);
        if (!item) {
            localStorage.setItem(key, JSON.stringify(initialValue));
            return initialValue;
        }
        if (cookie) {
            document.cookie = `${cookie}=${initialValue}`;
        }
        return JSON.parse(item);
    } catch (error) {
        console.log(error);
        return initialValue;
    }
};

export const useLocalStorage = <T>(
    key: string,
    initialValue: T,
    { cookie = null } = {}
): [T, (val: T) => void] => {
    const keyAtom =
        (atoms[key] as PrimitiveAtom<T>) ||
        (atoms[key] = atom(
            getInitialValue(key, initialValue, { cookie })
        ) as PrimitiveAtom<T>);
    const [storedValue, setStoredValue] = useAtom(keyAtom as PrimitiveAtom<T>);

    const setValue = (value: T) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            if (cookie) {
                document.cookie = `${cookie}=${valueToStore}`;
            }
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};
