export default {
    decodeAvatar: function (avatar) {
        if(avatar) {
            var binary = '';
            var bytes = new Uint8Array(avatar.data);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            var decoded = window.btoa(binary);
            return ("data:image/png;base64," + decoded);
        } else {
            return "/assets/default_profile_picture.png";
        }
    }
}