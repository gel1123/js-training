export const ManageDateClosure = (date) => {
    const _date = date;
    return {
        getDate() {
            return _date;
        }
    }
};