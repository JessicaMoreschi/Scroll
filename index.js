
var regione = 'Abruzzo';
var service = 'Cardiological examination';
let regioneWait, serviceWait, lineHeight
let runDays = false
let getPrivate = false

let dayElapsed = 0
let dday = 02
let mmonthN = 2
let mmonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function openDropMenu(i) {
    document.getElementsByClassName('dropdown-menu')[i].style.display = 'block'
}

function closeDropMenu(i) {
    document.getElementsByClassName('dropdown-menu')[i].style.display = 'none'
}

function changeInputLabel(t, i) {
    document.getElementById('labelName' + i).innerHTML = t.innerHTML;
    if (i == 0) {
        regione = t.innerHTML
    } else { service = t.innerHTML }
}


data = d3.csv("assets/dataset/dataset.csv");
data.then(function (data) {
    for (let el = 0; el < 2; el++) {
        d3.select('#dropdown-menu' + el)
            .append('h3')
            .attr('class', 'dropdown-item')

        let items1 = d3.select('#dropdown-menu' + el).select(".dropdown-item")

        items1.selectAll("div")
            .data(data)
            .join("h3")
            .attr('onclick', 'changeInputLabel(this, ' + el + ')')
            .text(function (d) {
                if (el == 0) { return (d.regione) }
                else if (el == 1) { return (d.service) }
            })
    }
})





function changePage() {
    d3.select('.header').select('img').attr('src', 'assets/icons/arrow.svg')
        .on('click', function () {
            location.href = 'index.html'
        })
    d3.select('.header').select('h2').text('HealthCare system')
    d3.select('.mainContent').selectAll('div').remove()
    d3.select('.mainContent').select('.btnFixed').remove()

    d3.select('.mainContent').append('div')
        .attr('class', 'flex-row tagsContainer')
    for (let tag = 0; tag < 2; tag++) {

        d3.select('.mainContent').select('div')
            .append('button')
            .attr('class', 'flex-row squareTag')
            .attr('id', 'squareTag' + tag)

        let tags = d3.select('.mainContent').select('#squareTag' + tag)
        tags
            .append('h5')
            .style('color', 'var(--main-color)')
            .text(function () {
                if (tag == 0) { return regione }
                else { return service }
            })

        tags
            .append('img')
            .attr('src', 'assets/icons/x.svg')

    }



    //scroll
    //line
    d3.select('.mainContent').append('div')
        .attr('class', 'scrollContainer')
        .attr('onscroll', 'scrollFunction()')
        .append('div')
        .attr('id', 'line')
        .append('div')
        .attr('id', 'lineRiga')
    d3.select('.scrollContainer')
        .append('div')
        .attr('class', 'flex-column days')

    //days centrale
    d3.select('.mainContent').append('div')
        .attr('class', 'flex-column daysCentraleContainer')
        .append('h1')
        .style('font-size', '64px')
        .style('width', '300px')
        .style('color', 'var(--primary-color)')
        .style('padding-top', '30px')
        .text(function () {
            return dayElapsed + ' Day'
        })
    d3.select('.mainContent').select('.daysCentraleContainer')
        .append('p')
        .text("This is how much you've waited. Don't loose hope, health is the most important thing!")


    //keep scroll
    d3.select('.mainContent').append('h5')
        .text('keep scrolling')
        .attr('id', 'keepScrol')

    d3.select('#private').style('display', 'flex')
        .on('click', function () { d3.select('.overlay').style('display', 'block') })




    d3.select('.mainContent').append('div')
        .attr('class', 'overlay')
        .append('div')
        .attr('class', 'flex-column overlayContent')
    let alertBox = d3.select('.overlay').select('.overlayContent')
    alertBox.append('img')
        .attr('src', 'assets/icons/building.svg')
    alertBox.append('h1')
        .text('Do you want to access the private system?')
    alertBox.append('p')
        .text('The private healthcare significantly shortens waiting times and provides you with better services and more flexible schedules for your needs!')
    alertBox.append('div')
        .append('h5')
        .text('Reject')
        .on('click', function () {
            d3.select('.overlay').style('display', 'none');
            document.getElementsByClassName('scrollContainer')[0].scrollBy({
                top: 500,
                left: 0,
                behavior: 'smooth'
            });
        })
    alertBox.select('div')
        .attr('class', 'flex-row footerAlert')
        .append('button')
        .on('click', function () {
            d3.select('.overlay').style('display', 'none');
            document.getElementsByClassName('scrollContainer')[0].scrollTo({
                top: lineHeight,
                left: 0,
                behavior: 'smooth'
            });
            getPrivate = true
        })
        .attr('class', 'roundButton')
        .text('Accept')

    //access stat
    d3.select('.mainContent').append('div').append('button')
        .on('click', function () {
            location.href = 'stat.html'
        })
        .attr('class', 'btnFixed roundButton')
        .attr('id', 'accessStatBtn')
        .style('display', 'none')
        .text('Discover')
    getH()
}




function scrollFunction() {
    dayElapsed = Math.floor((document.getElementsByClassName('scrollContainer')[0].scrollTop) / 1000)
    if (dayElapsed % 21 == 0 && dayElapsed > 20 && getPrivate == false) {
        d3.select('.overlay').style('display', 'block');
    }
    d3.select('.daysCentraleContainer').select('h1').text(dayElapsed + ' Days')
    if ((lineHeight - document.getElementsByClassName('scrollContainer')[0].scrollTop) < 1600) {
        d3.select('#accessStatBtn').style('display', 'flex')

    }
}

function getH() {
    let dataRegion = document.querySelector("#squareTag0 > h5").innerHTML
    let dataService = document.querySelector("#squareTag1 > h5").innerHTML
    d3.csv("assets/dataset/dataset.csv", function (data) {
        if (data.regione == dataRegion) { regioneWait = data.regioneWait }
        if (data.service == dataService) { serviceWait = data.serviceWait }


        
        lineHeight = (regioneWait * serviceWait) * 1000
        if (lineHeight > 0 && lineHeight != undefined && lineHeight != NaN) {
            d3.select('#line').style('height', function () {
                return lineHeight + 'px'
            })
             d3.select('.scrollContainer').select('.days').style('height', function () {
                return lineHeight + 'px'
            })

            if (runDays == false) {
                setDays()
                runDays = true
            }
        }
    })


}

function setDays() {
    d3.select('.days').style('gap', function () { return (lineHeight - ((lineHeight / 1000) * 36)) / (lineHeight / 1000) + 'px' })
    for (let day = 0; day < lineHeight / 1000; day++) {
        d3.select('.days')
            .append('h5')
            .style('color', 'var(--main-color)')
            .text(
                function () {
                    if (dday < 31) {
                        dday++
                    } else { dday = 01; 
                        if(mmonthN<12)
                        {mmonthN++} else{mmonthN=0} }

                    return (dday + ' ' + mmonth[mmonthN])
                }
            )
    }

}

function runAnimation() {
    setTimeout(() => {
        document.getElementsByClassName('rect')[0].style.height = 48.4 + '%'
        document.getElementsByClassName('rect')[1].style.height = 51.6 + '%'
    }, 1000);
    setTimeout(() => {
        d3.selectAll('.rect').selectAll('h4').style('display', 'block')
        d3.selectAll('.infogHalf').selectAll('.flex-column').style('width', 70 + '%')
    }, 2000);
    setTimeout(() => {
        d3.selectAll('.infogHalf').selectAll('.flex-column').style('opacity', 100 + '%')
    }, 3000);


    d3.select('.mainContent').append('div').append('button')
        .attr('class', 'btnFixed roundButton')
        .text('Next')
        .on('click', function () {
            d3.select('.mainContent').select('h2').text('The average of wait time in days is significantly different')
            d3.selectAll('.rect').selectAll('h4').text('7g')
            d3.selectAll('.rect').select('#stat2').text('32g')
            // d3.select('#metàSup').selectAll('h3').text('Private facilities waiting time')
            // d3.select('#metàSott').selectAll('h3').text('Public facilities waiting time')

            document.getElementsByClassName('rect')[0].style.height = 17 + '%'
            document.getElementsByClassName('rect')[1].style.height = 64 + '%'

            d3.select('.mainContent').select('.roundButton')
                .on('click', function () {
                    d3.select('.mainContent').select('.roundButton').text('Restart')
                    d3.select('.mainContent').select('h2').text('Average of wait time in days per region')
                    d3.select('#metàSup').style('display', 'none')
                    d3.selectAll('.rect').select('#stat2').text('30')
                    d3.select('#metàSott').style('height', 'auto')
                    d3.select('#metàSott').selectAll('div').remove()
                    d3.select('#metàSott').append('img')
                        .attr('src', 'assets/icons/stat.svg')

                    d3.select('.mainContent').select('.roundButton')
                        .on('click', function () {
                            location.href = 'index.html'
                        })
                })
        })


}
