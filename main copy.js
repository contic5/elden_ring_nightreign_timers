class Timer
{
    constructor(event_name,starting_time)
    {
        this.event_name=event_name;

        this.starting_time=starting_time;
        this.time=starting_time;

        this.timer_div=document.createElement("div");
        timer_holder.appendChild(this.timer_div);

        this.event_name_element=document.createElement("h2");
        this.timer_div.appendChild(this.event_name_element);
        this.event_name_element.innerHTML=this.event_name;

        this.time_element=document.createElement("h2");
        this.timer_div.appendChild(this.time_element);

        this.svg_element=document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg_element.setAttribute("width","250");
        this.svg_element.setAttribute("height","250");
        this.svg_element.setAttribute("viewBox","0 0 250 250");
        this.timer_div.appendChild(this.svg_element);

        this.background_path=document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.path.setAttribute("fill","lightblue");
        this.path.setAttribute("stroke","blue");
        this.path.setAttribute("stroke-width","2");
        this.svg_element.appendChild(this.path);

        this.path=document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.path.setAttribute("fill","lightblue");
        this.path.setAttribute("stroke","blue");
        this.path.setAttribute("stroke-width","2");
        this.svg_element.appendChild(this.path);
    }
    tick_down()
    {
        if(this.time>0)
        {
            this.time=this.time-(test_speed_factor*interval_time/1000);
        }
    }
    reset_time()
    {
        this.time=this.starting_time;

        this.update_svg();
    }
    display_current_time()
    {
        let written_time="";
        let minutes=Math.floor(this.time/60);
        let written_minutes=minutes.toString();

        let seconds=Math.floor(this.time-60*minutes);
        let written_seconds=seconds.toString();
        if(written_seconds.length<2)
        {
            written_seconds="0"+written_seconds;
        }
        written_time=written_minutes+":"+written_seconds;
        this.time_element.innerHTML=written_time;

        this.update_svg();
    }
    update_svg()
    {

        if(this.time>this.starting_time/2)
        {
            this.path.setAttribute("fill","lightgreen");
            this.path.setAttribute("stroke","green");
        }
        else if(this.time>this.starting_time/4)
        {
            this.path.setAttribute("fill","gold");
            this.path.setAttribute("stroke","yellow");
        }
        else
        {
            this.path.setAttribute("fill","red");
            this.path.setAttribute("stroke","darkred");
        }

        let angle=2*Math.PI*(this.time/this.starting_time)+0.01;

        const center_x=125;
        const center_y=125;
        const radius=100;

        let start_x=radius*Math.cos(0)+center_x;
        let start_y=radius*Math.sin(0)+center_y;

        let x=radius*Math.cos(angle)+center_x;
        let y=radius*Math.sin(angle)+center_y;
        
        let d="";
        d+=`M ${center_y},${center_x} `;
        d+=`L ${start_x},${start_y} `;

        if(angle>2*Math.PI-0.01)
        {
            d+=`L ${start_x},${start_y} `;
            d+=`A 100,100 0 1,1 25,125 `;
            d+=`A 100,100 0 1,1 ${start_x},${start_y}`;
        }
        else
        {
            // Partial circle
            let largeArcFlag = angle > Math.PI ? 1 : 0;
            d += `A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y} `;
        }
        d+="Z";

        this.path.setAttribute("d",d);

        if(angle<0.02)
        {
            this.path.setAttribute("d","");
        }

        if(this.starting_time==270)
        {
            //console.log(angle);
        }
    }
}

function update_timers()
{
    for(let timer of timers)
    {
        timer.tick_down();
        timer.display_current_time();
    }
}
function resume_timers()
{
    if(my_interval!=null)
    {
        clearInterval(my_interval);
    }
    my_interval=setInterval(update_timers,interval_time);
    document.getElementById("toggle_button").innerHTML="Pause Timers";
}
function pause_timers()
{
    if(my_interval!=null)
    {
        clearInterval(my_interval);
        my_interval=null;
    }
    document.getElementById("toggle_button").innerHTML="Resume Timers";
}
function reset_timers()
{
    for(let timer of timers)
    {
        timer.reset_time();
        timer.display_current_time();
    }
    pause_timers();
}
function toggle_timers()
{
    if(my_interval!=null)
    {
        pause_timers();
    }
    else
    {
        resume_timers();
    }
}
function setup()
{
    timers.push(new Timer("First Circle Starts",270));
    timers.push(new Timer("First Circle Ends",450));
    timers.push(new Timer("Second Circle Starts",660));
    timers.push(new Timer("Second Circle Ends",840));
    
    for(let timer of timers)
    {
        timer.display_current_time();
    }
    my_interval=setInterval(update_timers,interval_time);
}

const timer_holder=document.getElementById("timer_holder");
let interval_time=100;

let test_speed_factor=1;
if(test_speed_factor!=1)
{
    alert(`The time is going ${test_speed_factor}x faster than normal.<br> Set test_speed factor to 1 to avoid this.`);
}
let timers=[];
let my_interval=null;
setup();