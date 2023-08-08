function initPage()
{
    fetchData();
    localStorage.removeItem('filters')
}
function loadOnDemand()
{
    localStorage.removeItem('filters')
    let rowsNum = document.getElementById("rowsNum");
    let categories = document.getElementById("categories");
    if(rowsNum.value != '' && categories.value =='')
    {
        fetchData(rowsNum.value);
    }
    else if(rowsNum.value =='' && categories.value !='')
    {
        fetchData(10,categories.value.split(','))
    }
    else if(rowsNum.value !='' && categories.value !='')
    {
        fetchData(rowsNum.value,categories.value.split(','))
    }
    else{
        fetchData()
    }
    
}
function fetchData(rowsNum=10,categories=["cat1","cat2"]) {
    //alert("document loaded")
    //categories = JSON.parse(categories);
    fetch(`https://filltext.com/?rows=${rowsNum}&fname={firstName}&lname={lastName}&category=${JSON.stringify(categories)}&pretty=true`)
        .then(response => response.json())
        .then(data => {
            document.getElementsByClassName("categories")[0].innerHTML ='';
            document.getElementsByClassName("listContainer")[0].innerHTML='';
            //console.log(data);
            let hashMap = new Map();
            data.forEach(element => {
                fillCategories(element.category,hashMap)
                let avatarInput = element.fname[0] + element.lname[0];
                var container = document.getElementsByClassName("listContainer");
                var card = "<div class='card' category='"+element.category+"'>"
                card += "<div class='avatar'>" + avatarInput + "</div>";
                card += "<div>";
                card += "<h3>" + element.fname+"</h3>";
                card += "<button class='btn-pill'><span>" + element.category+"</span></button>";
                card += "<p>" + element.lname;
                card += "</div></div>";
                container[0].innerHTML += card;
            });
            appendCategoryButtons(hashMap);
            // let cats =document.getElementsByClassName(".categoryFilter");
            // cats.forEach(elem=>{
            //     elem.addEventListener('click',filterByCategory)
            // })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function appendCategoryButtons(hashMap) {
    let categoriesList = document.getElementsByClassName("categories")
    hashMap = new Map([...hashMap].sort());
    hashMap.forEach(element=>{
        let catButton = `<li><a href="#" id='${element}' onclick=filterByCategory('${element}') class="categoryFilter round green">`;
        catButton += element;
        catButton += '<span class="round">';
        catButton += element;
        catButton += '</span></a></li>';
        categoriesList[0].innerHTML += catButton;
    })
}
function fillCategories(categoryName,hashMap) {
    hashMap.set(categoryName, categoryName);
}
function filterByCategory(filterCategory)
{
    let appliedFilters =[];
     appliedFilters = JSON.parse(localStorage.getItem("filters"));
    let items = document.querySelectorAll(`[category='${filterCategory}']`)
    let clickedElement = document.getElementById(filterCategory);
    if(appliedFilters == undefined)
    {
        appliedFilters =[];
    }
    
    let filterIndex = appliedFilters.indexOf(filterCategory);
    if(filterIndex>-1)
    {
        clickedElement.style.background =''
        appliedFilters.splice(filterIndex,1);
        items.forEach(element=>{
            element.style.display='';
        })
    }
    else{
        appliedFilters.push(filterCategory);
        clickedElement.style.background ='gray'
        items.forEach(element=>{
            element.style.display='none';
        })
        
    }
    
    localStorage.setItem('filters',JSON.stringify(appliedFilters));
    console.log(JSON.parse(localStorage.getItem("filters")))
}
window.onload = initPage();