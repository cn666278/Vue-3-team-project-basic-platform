export interface configType {
    title: string;
    param: configParam[];
}
interface configParam {
    label: string;
    type: "string" | "boolean" | "number";
    paramName: string;
    span: number;
    rows?: number;
}