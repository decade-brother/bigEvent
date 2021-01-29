$(function() {
    function getPersonInfo() {
        axios.get('/my/userinfo').then(res => {
            console.log(res);
        })
    }
    getPersonInfo()
})