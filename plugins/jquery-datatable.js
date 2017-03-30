$(function () {
     table = $('.js-basic-example').DataTable({
         rowId: '_id',
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
             { data: 'pricelist' },
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