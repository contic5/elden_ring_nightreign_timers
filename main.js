class Timer
{
    constructor(event_name,start_time,max_time)
    {
        this.event_name=event_name;

        this.start_time=start_time;
        this.max_time=max_time;
        this.time=max_time;
        this.time_passed=0;

        this.timer_div=document.createElement("div");
        this.timer_div.classList.add("timer_div");
        timer_holder.appendChild(this.timer_div);

        this.event_name_element=document.createElement("h2");
        this.timer_div.appendChild(this.event_name_element);
        this.event_name_element.innerHTML=this.event_name;

        this.time_h2=document.createElement("h2");
        this.timer_div.appendChild(this.time_h2);

        this.svg_element=document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg_element.setAttribute("width","250");
        this.svg_element.setAttribute("height","250");
        this.svg_element.setAttribute("viewBox","0 0 250 250");
        this.timer_div.appendChild(this.svg_element);

        this.background_path=document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.background_path.setAttribute("fill","black");
        this.background_path.setAttribute("stroke","black");
        this.background_path.setAttribute("stroke-width","2");
        this.svg_element.appendChild(this.background_path);
        this.set_background_path();

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
            this.time_passed+=(test_speed_factor*interval_time/1000);
        }
    }
    reset_time()
    {
        this.time=this.max_time;
        this.time_passed=0;

        this.update_path();
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
        this.time_h2.innerHTML=written_time;

        this.update_path();
    }
    get_full_circle()
    {
        let d="";
        d+=`M ${center_y},${center_x} `;
        d+=`L ${start_x},${start_y} `;

        d+=`L ${start_x},${start_y} `;
        d+=`A ${radius},${radius} 0 1,1 ${mid_x},${mid_y} `;
        d+=`A ${radius},${radius} 0 1,1 ${start_x},${start_y}`;
        d+="Z";
        return d;
    }
    set_background_path()
    {

        let d=this.get_full_circle();
        this.background_path.setAttribute("d",d);
    }
    update_path()
    {

        if(this.time>120)
        {
            this.path.setAttribute("fill","lightgreen");
            this.path.setAttribute("stroke","green");
        }
        else if(this.time>60)
        {
            this.path.setAttribute("fill","gold");
            this.path.setAttribute("stroke","yellow");
        }
        else
        {
            this.path.setAttribute("fill","red");
            this.path.setAttribute("stroke","darkred");
        }


        let percent_complete=(this.time_passed-this.start_time)/(this.max_time-this.start_time);
        percent_complete*=2*Math.PI;
        let angle=2*Math.PI-percent_complete;

        let d="";
        if(this.time_passed<this.start_time)
        {
            d=this.get_full_circle();
            this.path.setAttribute("d",d);
            return;
        }
        if(angle<0.02)
        {
            this.path.setAttribute("d",d);
            return;
        }

        let x=radius*Math.cos(angle)+center_x;
        let y=radius*Math.sin(angle)+center_y;
        
       
        if(angle>2*Math.PI-0.01)
        {
            d=this.get_full_circle();
        }
        else
        {
            d+=`M ${center_y},${center_x} `;
            d+=`L ${start_x},${start_y} `;
            // Partial circle
            let largeArcFlag = angle > Math.PI ? 1 : 0;
            d += `A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y} `;
            d+="Z";
        }
        
        this.path.setAttribute("d",d);

        if(this.max_time==270)
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
    timers.push(new Timer("First Circle Starts",0,270));
    timers.push(new Timer("First Circle Ends",270,450));
    timers.push(new Timer("Second Circle Starts",450,660));
    timers.push(new Timer("Second Circle Ends",660,840));
    
    for(let timer of timers)
    {
        timer.display_current_time();
    }
    my_interval=setInterval(update_timers,interval_time);
}

const timer_holder=document.getElementById("timer_holder");
let interval_time=100;

let test_speed_factor=50;
if(test_speed_factor!=1)
{
    alert(`The time is going ${test_speed_factor}x faster than normal.<br> Set test_speed factor to 1 to avoid this.`);
}
let timers=[];
let my_interval=null;

const center_x=125;
const center_y=125;
const radius=120;

const start_x=radius*Math.cos(0)+center_x;
const start_y=radius*Math.sin(0)+center_y;

const mid_x=radius*Math.cos(Math.PI)+center_x;
const mid_y=radius*Math.sin(Math.PI)+center_y;

setup();