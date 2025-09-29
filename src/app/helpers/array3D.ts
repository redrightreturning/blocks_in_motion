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

    static newFromArray(array : Array3DType): Array3DType {
        return structuredClone(array)            
    }

    static updateIndex(index : IndexType, array3D: Array3DType) : Array3DType {
        const newArray = array3D.map((xArray, x) =>
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

    static isClickableBottomLayer(index: IndexType, array3D: Array3DType) : boolean {
        //A box is not clickable if there is a box directly above it
        if((index.y + 1 < array3D[index.x].length) && array3D[index.x][index.y + 1][index.z]) return false
        //A box is clickable if it is on the bottom layer of the grid
        if(index.y === 0) return true
        //Or if there is a box directly below it
        if(array3D[index.x][index.y - 1][index.z]) return true
        return false
    }

}