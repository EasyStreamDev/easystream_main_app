import { LocalStorage } from '../../LocalStorage/LocalStorage';

const compare = (x: any, y: any) => {
    const srt = (obj: any) => JSON.stringify(obj)?.split('').sort().join('');
    return srt(x) === srt(y);
};

let result1: any = null;
let result2: any = null;
beforeEach(() => {
    result1 = '{ "name":"John", "age":30, "car":"bmw"}';
    result2 = { "name":"John", "age":30, "car":"bmw"};
});

afterEach(() => {
    LocalStorage.removeItem("test1");
    LocalStorage.removeItem("test2");
    LocalStorage.removeItem("test3");
})

it("Testing LocalStorage.setItem", () => {
    LocalStorage.setItem("test1", result1);
    const test1 = LocalStorage.getItem("test1")
    expect(test1).toEqual(result1)

    LocalStorage.setItem("test2", "");
    const test2 = LocalStorage.getItem("test2")
    expect(test2).toBe("");
});

it("Testing LocalStorage.setItemObject", () => {
    LocalStorage.setItemObject("test1", result2);
    const test1 = LocalStorage.getItemObject("test1")
    expect(compare(test1, result2)).toBeTruthy();

    LocalStorage.setItemObject("test2", null);
    const test2 = LocalStorage.getItemObject("test2")
    expect(test2).toBe(null);

    LocalStorage.setItemObject("test3", {});
    const test3 = LocalStorage.getItemObject("test3");
    expect(compare(test3, {})).toBeTruthy();
});

it("Testing LocalStorage.getItem", () => {
    const test1 = LocalStorage.getItem("test1")
    expect(test1).toBe(null);

    LocalStorage.setItem("test2", result1);
    const test2 = localStorage.getItem("test2")
    expect(test2).toEqual(result1)
});

it("Testing LocalStorage.getItemObject", () => {
    const test1 = LocalStorage.getItemObject("test1")
    expect(test1).toBe(null);

    LocalStorage.setItem("test2", result2);
    const test2 = LocalStorage.getItemObject("test2")
    expect(test2).toEqual(null);

    LocalStorage.setItemObject("test3", result2);
    const test3 = LocalStorage.getItemObject("test3")
    expect(test3).toEqual(result2);
});

it("Testing LocalStorage.isSupported", () => {
    const value = LocalStorage.isSupported();
    expect(value).toBeTruthy()
});

it("Testing localStorage not loaded", () => {
    global.Storage.prototype.getItem = jest.fn((key) => {throw new Error("")})
    const value = LocalStorage.isSupported();
    expect(value).toBeFalsy();
})
