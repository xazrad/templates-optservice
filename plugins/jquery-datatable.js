$(function () {
     table = $('.js-basic-example').DataTable({
        responsive: true,
        paging:   false,
        ordering: false,
        info:     false,
        searching: false,
        language: {
             "sEmptyTable": "Данные отсутствуют"
        },
         columns: [
             { data: '_id' },
             { data: 'name' },
             { data: 'supervisor' },
             { data: 'price' },
             { data: 'assortiment' },
             { data: 'van' },
         ]
        //  columnDefs: [
        //     {
        //         "targets": [ 0 ],
        //         "visible": false,
        //     }
        // ]
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