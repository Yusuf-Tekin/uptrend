

export const detectTags = (text:string):string[] => {

    const tags = text.split(" ").map((text) => text.startsWith("#") ? text+"TAG" : text)


    return tags;
}