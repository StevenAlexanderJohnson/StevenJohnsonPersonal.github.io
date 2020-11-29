function searchGhost()
{
    let trs = $('#phasmophobiaTable').find("tbody").find("tr");
    trs.each(function()
    {
        this.style.display = "table";
    })

    let selectList = [];
    let selects = $('#phasmophobiaInputWrapper').find("select");
    selects.each(function()
    {
        if(this.value !== "-1")
        {
            selectList.push(this.value);
        }
    })
    trs.each(function() {
        let tds = $(this).find('td');
        let evidence = [tds.eq(2).text().trim(), tds.eq(3).text().trim(), tds.eq(4).text().trim()];
        let index = 0;
        while(index < selectList.length)
        {
            if(!evidence.includes(selectList[index]))
            {
                this.style.display = "none";
            }
            index += 1;
        }
    })
}

function resetSearch()
{
    $('#phasmophobiaInputWrapper').find('select').each(
        function()
        {
            $(this).val('-1');
        }
    )
    searchGhost();
}