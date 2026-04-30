import { describe, expect, test } from "vitest";
describe("Math.sqrt", () => {
    test("should return the square root of a number", ()=>{
        expect(Math.sqrt(4)).toBe(2);
        expect(Math.sqrt(9)).toBe(3);
        expect(Math.sqrt(16)).toBe(4);
    })
    test("should return NaN for negative numbers",()=>{
        expect(Math.sqrt(-1)).toBeNaN();
    })
    test("should return 0 for 0",()=>{
        expect(Math.sqrt(0)).toBe(0);
    })
})