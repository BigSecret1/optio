export function isAdmin(roles) {
    for(let i = 0; i < roles.length; ++i) {
        if(roles[i].toLowerCase() === "admin") {
            return true;
        }
    }
    return false;
}
