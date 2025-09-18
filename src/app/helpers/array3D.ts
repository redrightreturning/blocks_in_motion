import { IndexType } from "../types/indexType.interface"

export type Array3DType = boolean[][][]

export class Array3D {
    
    static newArray(size : number, initialValue: boolean = false): Array3DType {
        const newArray = 
            Array.from({ length: size }, () =>
                    Array.from({ length: size }, () =>
                    Array.from({ length: size }, () => initialValue)
                    )
                )
        return newArray
                
    }

    static updateIndex(index : IndexType, array3D: Array3DType) : Array3DType {
        let newArray = array3D.map((xArray, x) =>
            x === index.x
                ? xArray.map((yArray: boolean[], y: number) =>
                    y === index.y
                    ? yArray.map((val, z) => z === index.z ? !val : val)
                    : yArray
                )
                : xArray
        )
        return newArray
    }

}