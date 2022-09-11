const phoneNumberFormatter = function(number){
    //remove characters other than numbers
    let formatted = number.replace('/\D/g','');

    //remove number 0
    if(formatted.startsWith('0')){
        formatted = '62'+formatted.substr(1);
    }
    if(!formatted.endsWith('@s.whatsapp.net')){
        formatted += '@s.whatsapp.net';
    }
    return formatted;



}
module.exports = {
    phoneNumberFormatter
}