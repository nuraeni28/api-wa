const { default: 
    makeWASocket,
    useMultiFileAuthState } = require("@adiwajshing/baileys");
    const qrTerm = require('qrcode-terminal');
    
    //untuk menampung setiap akun wa yang login
    const waSocket = []

    //function kirim pesan
    async function kirimPesan(socket){
        //id = nomor wa
        //text = pesan yang akan dikirim
        const id = 6285399987580 + "@s.whatsapp.net";
        const tomboltemplate = [
            {buttonId:"id1",buttonText:{displayText:"Button 1"},type:1},
            {buttonId:"id2",buttonText:{displayText:"Button 2"},type:1},
        ] ;
        const buttonMessage = {
            text:"Join Us",
            footer:"Tekan tombol ini",
            buttons:tomboltemplate,
            headerType:1 
        }
        // const kirim = await socket.sendMessage(id,{
        //     // text:"Hello"
            
        // });
         await socket.sendMessage(id,buttonMessage)
    }
    
    
    (async function main(wabaru) {
        const { state, saveCreds } = await useMultiFileAuthState("./" + wabaru);
    
        const socket = makeWASocket({
            printQRInTerminal: false,
            auth: state,
            browser: ["Kelas Bailey", "Chrome", "4.0.0"]
        });
    
        socket.ev.on("connection.update", (konek) => {
            if(konek.connection == "close") {
                main(wabaru)
            } else if(konek.connection == "open") {
                kirimPesan(socket);
                // waSocket.push({
                //     waID:wabaru,
                //     socket:socket
                // });
            } else if (konek.qr) {
                qrTerm.generate(konek.qr, {small: true})
            } 
    
        });
        socket.ev.on("creds.update", async (update) => {
            await saveCreds()
        })
    
    })("wabaru");
    