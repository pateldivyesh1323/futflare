const getIdFromSub = (sub: string): string => {
    const id = sub.split("|");
    return id[1];
};

export { getIdFromSub };
