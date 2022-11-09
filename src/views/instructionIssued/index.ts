export interface formData {
    name: string;
    label: string;
    type: "string" | "number" | "radio";
    value: string | number;
    props?: any;
    isEnable?: boolean;
}