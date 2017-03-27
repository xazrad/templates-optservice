$(function () {
    var table = $('.js-basic-example').DataTable({
        responsive: true,
        paging:   false,
        ordering: false,
        info:     false,
        searching: false        
    });

    $('.js-basic-example tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('bg-cyan') ) {
                console.log('remove');
                $(this).removeClass('bg-cyan');
            }
            else {
                console.log('add');
                table.$('tr.bg-cyan').removeClass('bg-cyan');
                $(this).addClass('bg-cyan');
            }
    });    

    //Exportable table
    $('.js-exportable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});