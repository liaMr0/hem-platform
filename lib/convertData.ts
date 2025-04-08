export const replaceMongoIdInArray = (array:any) => {
    const mappedArray = array.map((item:any) => {
      return {
        id: item._id.toString(),
        ...item
      }
    }).map(({_id, ...rest}) => rest);

    return mappedArray;
  }

  export const replaceMongoIdInObject = (obj:any) => {
    if(!obj) return null;

    const {_id, ...updatedObj} = {...obj, id: obj._id.toString()};
   return updatedObj;
  }

  export const getSlug = (title:any) => {
    if (!title) return null;

    const slug = title.toLowerCase().replace(/ /g, -'')
    .replace(/[^\w-]+/g, '');

    return slug;
  }