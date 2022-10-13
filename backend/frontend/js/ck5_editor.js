// CKEditor5 富文本编辑器

ClassicEditor
    .create( document.querySelector( '#ev-ck5-editor' ), {
        // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        toolbar: [
            'heading', '|',
            'bold', 'italic', 'blockQuote', '|', 
            'indent', 'outdent', 'numberedList', 'bulletedList', '|',
            'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
            'link', /* 'uploadImage',*/ 'imageUpload', 'mediaEmbed', '|',
            // 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight', 'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
            'undo', 'redo',
        ]
    } )
    .then( editor => {
        window.ev_ckeditor = editor;
    } )
    .catch( err => {
        console.error( err.stack );
    } );