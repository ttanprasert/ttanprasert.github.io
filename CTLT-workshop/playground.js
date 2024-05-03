const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const task = urlParams.get('task');

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = "sk-" + id + "B" + task + "1c";

messages = [];
var m = document.getElementById("model");
var method = document.getElementById("method");
var temperature = document.getElementById("temperature");
var slider = document.getElementById("tempSlider");

slider.oninput = function() {
    temperature.innerHTML = "Temperature: " + slider.value/100;
}

function chooseMethod() {
    console.log(method.value);
    if (method.value == 0) {
        document.getElementById("train-context").disabled = false;
        document.getElementById("train-examples").disabled = true;
    } else if (method.value == 1) {
        document.getElementById("train-context").disabled = true;
        document.getElementById("train-examples").disabled = false;
    } else {
        document.getElementById("train-context").disabled = false;
        document.getElementById("train-examples").disabled = false;
    }
}

function generateOutput() {
    messages = [];

    document.getElementById("output-text").innerHTML = "";
    document.getElementById("loading").style.display = "block";

    var context = document.getElementById("train-context").value;
    var input = document.getElementById("test-input").value;
    var examples = document.getElementById("train-examples").value;

    if(method.value == 0) {
        messages.push({"role": "system", "content": context});
    } else if (method == 1) {
        messages.push({"role": "system", "content": "Here are the examples:\n" + examples});
    } else {
        messages.push({"role": "system", "content": context + "\nHere are the examples:\n" + examples});   
    }

    messages.push({"role": "user", "content": input});
    sendAIMessage();
    
}

function displayOutput(output) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("output-text").innerHTML = output.replace(/\n/g,'<br />');
}

async function sendAIMessage()
{
  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: m.options[m.selectedIndex].text,
        messages: messages,
        temperature: slider.value/100,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    //console.log(data.choices[0].message.content);
    displayOutput(data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false);
  }
}
