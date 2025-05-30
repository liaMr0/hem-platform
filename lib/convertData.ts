// export const replaceMongoIdInArray = (array:any) => {
//     const mappedArray = array.map((item:any) => {
//       return {
//         id: item._id.toString(),
//         ...item
//       }
//     }).map(({_id, ...rest}) => rest);

//     return mappedArray;
//   }

//   export const replaceMongoIdInObject = (obj:any) => {
//     if(!obj) return null;

//     const {_id, ...updatedObj} = {...obj, id: obj._id.toString()};
//    return updatedObj;
//   }

  export const getSlug = (title:any) => {
    if (!title) return null;

    const slug = title.toLowerCase().replace(/ /g, -'')
    .replace(/[^\w-]+/g, '');

    return slug;
  }

// Convierte un objeto con posibles ObjectId en uno plano con id:string
export function replaceMongoIdInObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(replaceMongoIdInObject);
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];

      if (key === "_id") {
        result["id"] = value.toString(); // renombra _id a id
      } else if (typeof value === "object" && value !== null) {
        result[key] = replaceMongoIdInObject(value); // recursivo
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
}

// Aplica la función a cada objeto del array
export function replaceMongoIdInArray(array: any[]): any[] {
  return array.map(replaceMongoIdInObject);
}


