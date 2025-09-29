export type GridModeType = "bottomUp" | "slice"

export type RenderType = "primary" | "secondary" | "tertiary"

//Clickable indicates if box will respond to hover and nothing else
export interface BoxType {
    clickable: boolean
    rendered: boolean
    type: RenderType
}