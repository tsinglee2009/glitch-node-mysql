
cropper_instance = {}

/*
    <div class="ev-avatar">
        <!-- 图片裁剪框 start -->
        <div class="ev-avatar-container">
            <img id="ev-avatar-image" src="./images/logo.png">
        </div>
        <!-- 图片裁剪框 end -->
        <input class="ev-avartar-file" type="file">
    </div>
*/

cropper_instance.init = () => {

    var $image = $('#ev-avatar-image');
    
    $image.cropper({
        aspectRatio: 16 / 9,
        crop: function(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
        }
    });

}

cropper_instance.getData = () => {
    // Get the Cropper.js instance after initialized
    var cropper = $image.data('cropper');
}

module.exports = { cropper_instance }
