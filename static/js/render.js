let results = $("#results")
let coaForm = $("#coa-form")
let searchRequest = null;
let codeBox = $("#codeBox")
let batchBox = $("#batchBox")
let resultInfoText = $("#result-info-text")


$(document).ready(function () {

    $(document).ajaxSend(function () {
        results.html('<i id="loading-spinner" class="display-1 m-3 fas fa-cog text-success text-center load-rotate"></i>')
    })

    coaForm.submit(function (e) {

        resultInfoText.hide()

        codeValue = codeBox.val()
        batchValue = batchBox.val()

        searchRequest = $.ajax({
            type: "POST",
            url: window.post_url,
            data: {
                "code": codeValue,
                "batch": batchValue
            },
            success: function (data) {
                console.log(data)

                if (data.coa_fn !== "None" && data.coa_s_fn !== "None") {
                    results.html('' +
                        '<div class="container">\n' +
                        '    <h3>' + data.last_code + ' ürün kodu ve ' + batchBox.val() + ' batch numarası için sonuç bulundu, indirmek için aşağıda ki linkleri kullanın.</h3>\n' +
                        '    <div class="btn-group flex-wrap btn-group-lg" data-toggle="buttons">\n' +
                        '        <a href="' + data.dl_link + '" class="btn btn-primary"><b>COA </b>' + data.coa_fn + '</a>\n' +
                        '        <a href="' + data.tds + '" class="btn btn-success"><b>TDS </b>' + data.tds_fn + '</a>\n' +
                        '        <a href="' + data.msds + '" class="btn btn-warning"><b>MSDS </b>' + data.msds_fn + '</a>\n' +
                        '    </div>\n' +
                        '</div>\n')
                } else if (data.coa_fn === "None" && data.coa_s_fn !== "None") {
                    results.html('' +
                        '<div class="container">\n' +
                        '    <h3>' + data.code + ' için örnek sertifika bulundu, indirmek için aşağıda ki linkleri kullanın.</h3>\n' +
                        '    <div class="btn-group flex-wrap btn-group-lg" data-toggle="buttons">\n' +
                        '        <a href="' + data.dl_sample_link + '" class="btn btn-primary"><b>COA </b>' + data.coa_s_fn + '</a>\n' +
                        '        <a href="' + data.tds + '" class="btn btn-success"><b>TDS </b>' + data.tds_fn + '</a>\n' +
                        '        <a href="' + data.msds + '" class="btn btn-warning"><b>MSDS </b>' + data.msds_fn + '</a>\n' +
                        '    </div>\n' +
                        '</div>\n')
                }


                if (batchBox.val().length > 0) {
                    results.append('<div class="container mt-3"><i class="text-danger fas fa-exclamation-triangle"></i><span class="text-danger font-weight-bold text-uppercase"> Örnek sertifika değildir! Girilen Batch: ' + batchBox.val() + '</span></div>')
                }

            },
            error: function (errObj, errStr, optStr) {
                results.html("<h3>Sertifika Bulunamadı. Ürün kodunu doğru girdiğinizden emin olun.</h3><p>Kodun doğru olduğundan emin iseniz Öndere söyleyin</p>")
            }
        })
        e.preventDefault();
    })
})