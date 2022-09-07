(function(){

    var pizzasDataSet = {};
    var toppingsDataSet = {}

    window.onload = function() {
        allToppings();
        allPizzas();
        selectedToppings();
		
	};


    // Show all pizzas
    function allPizzas(){
        var url = "https:/dark-teal-cygnet-tux.cyclic.app/pizzas";
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {   
                    response = JSON.parse(responseText);
                    var allPizzas = {}
                    for (var i = 0; i < response["Pizzas"].length; i++) {
                        pizzasDataSet[response["Pizzas"][i]["PizzaName"]] = response["Pizzas"][i]["PizzaID"];
                        if(response["Pizzas"][i]["PizzaName"] in allPizzas){
                            allPizzas[response["Pizzas"][i]["PizzaName"]] += [response["Pizzas"][i]["ToppingName"], response["Pizzas"][i]["ToppingID"], response["Pizzas"][i]["PizzaID"], response["Pizzas"][i]["PizzaIngredientID"]]+ ";";
                        }
                        else{
                            allPizzas[response["Pizzas"][i]["PizzaName"]] = [response["Pizzas"][i]["ToppingName"], response["Pizzas"][i]["ToppingID"],  response["Pizzas"][i]["PizzaID"], response["Pizzas"][i]["PizzaIngredientID"]] + ";";
                        }
                    }
                    
                    for (const key in allPizzas) {
                        values = allPizzas[key].split(";");
                        values.pop();
                        console.log(key, values)
                        var div = document.createElement('div'); // Create Div
                        div.className = "pizzas";
                        div.id = values[0].split(",")[2];
                        //div.setAttribute("name", key);
                        var para = document.createElement('p'); // Create Paragragh
                        para.innerText = key + ": ";
                        div.appendChild(para);
                        for (let i = 0; i < values.length; i++) {
                            para.innerText += " " + values[i].split(",")[0] + ";"
                            
                        }
                        var updatebtn = document.createElement('button'); // Create Edit Button
                        updatebtn.className = "update-button";
                        updatebtn.innerText = "Update";
                        div.append(updatebtn);
                        updatebtn.onclick = function(event){editPizza(event.target.parentNode.id)};
                        var deletebtn = document.createElement('button'); // Create Delete Button
                        deletebtn.className = "delete-button";
                        deletebtn.innerText = "Delete";
                        div.appendChild(deletebtn);
                        deletebtn.onclick = function(event){deletePizza(event.target.parentNode.id)};
                        document.getElementsByClassName("main")[0].appendChild(div);
                        
                    }


                    console.log(allPizzas);

                    document.getElementsByClassName("new")[0].onclick = addPizza;
                    
                    document.getElementsByClassName("cancel")[0].onclick = cancelPizza;
                    document.getElementsByClassName("cancel")[1].onclick = cancelUpdate;
                    document.getElementsByClassName("cancel")[2].onclick = cancelDelete;
                    document.getElementsByClassName("add")[0].onclick = newPizza;
                })
                .catch(function(error) {
                    console.log(error);
            });
        
    }

    // All toppings for New Pizza
    function allToppings(){
        var url = "https:/dark-teal-cygnet-tux.cyclic.app/toppings";
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {   
                    response = JSON.parse(responseText);
                    //console.log(response);
                    for (var i = 0; i < response["Toppings"].length; i++) {
                        toppingsDataSet[response["Toppings"][i]["ToppingID"]]  = response["Toppings"][i]["ToppingName"];
                        var checkbox = document.getElementsByClassName("checkbox")[0];
                        var option = document.createElement('input'); // Create Input
                        option.type = "checkbox";
                        option.className = "checkbox";
                        option.id = response["Toppings"][i]["ToppingID"];
                        option.value = response["Toppings"][i]["ToppingID"];
                        
                        var label = document.createElement('label'); // Create Label
                        label.setAttribute("for", response["Toppings"][i]["ToppingName"]);
                        label.innerText = response["Toppings"][i]["ToppingName"];
                        var breakTag = document.createElement('br'); // Create Break
                        label.append(breakTag)
                        checkbox.appendChild(option);
                        checkbox.appendChild(label);

                    }
                })
                .catch(function(error) {
                    console.log(error);
            });
            console.log(toppingsDataSet);
        
    }


    function addPizza(){
        document.getElementsByClassName("add-new")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5";
    }


    function cancelPizza(){
        document.getElementsByClassName("add-new")[0].style.display = "none";
        document.getElementsByClassName("main")[0].style.opacity = "1"
    }

    function cancelUpdate(){
        document.getElementsByClassName("update")[0].style.display = "none";
        document.getElementsByClassName("main")[0].style.opacity = "1"
    }

    function cancelDelete(){
        document.getElementsByClassName("delete")[0].style.display = "none";
        document.getElementsByClassName("main")[0].style.opacity = "1"
    }

    function deletePizza(id) {
        pizzaID = id;
        console.log(pizzaID);

        document.getElementsByClassName("delete")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5"

        document.getElementsByClassName("yes")[0].onclick = function(){deletePizzaConfirmed(pizzaID)};

    }


    function editPizza(id) {
        pizzaID = id;

        console.log(pizzaID)

        document.getElementsByClassName("update")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5"

        var existingPizzaName = Object.keys(pizzasDataSet).find(key => pizzasDataSet[key] == id);
        console.log(existingPizzaName);
        document.getElementsByClassName("update-name")[0].value = existingPizzaName;

        document.getElementsByClassName("update-pizza")[0].onclick = function(){updatePizza(pizzaID)};

    }

    function selectedToppings(){
        var url = "https:/dark-teal-cygnet-tux.cyclic.app/toppings";
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {   
                    response = JSON.parse(responseText);
                    for (var i = 0; i < response["Toppings"].length; i++) {
                        var checkbox = document.getElementsByClassName("checkbox-update")[0];

                        var option = document.createElement('input'); // Create Input
                        option.type = "checkbox";
                        option.className = "checkbox-update";
                        option.value = response["Toppings"][i]["ToppingID"];
                        option.setAttribute("name", response["Toppings"][i]["ToppingID"]);
                        var label = document.createElement('label'); // Create Label
                        label.setAttribute("for", response["Toppings"][i]["ToppingName"]);
                        label.innerText = response["Toppings"][i]["ToppingName"];
                        var breakTag = document.createElement('br'); // Create Break
                        label.append(breakTag);
                        checkbox.appendChild(option);
                        checkbox.appendChild(label);

                    }
                })
                .catch(function(error) {
                    console.log(error);
            });
            console.log(toppingsDataSet);
        
    }


    function deletePizzaConfirmed(id){
        toppingID = id;

        cancelPizza();
        const data = JSON.stringify({
            "pizzaID": id,
        });

        const fetchOptions = {
            method : 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body : data
        };
        var url = "https:/dark-teal-cygnet-tux.cyclic.app/deletepizza";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Pizza Successfully deleted!");
                    location.reload();
            
                }

                else{
                    alert("Pizza could not be deleted!");
                }
			})
			.catch(function(error) {
				console.log(error);
   		});
        document.getElementsByClassName("main")[0].style.opacity = "1";
    }

    function updatePizza(id){
        
        var pizzaName = document.getElementsByClassName("update-name")[0].value;
        console.log(pizzaName.length, pizzaName in pizzasDataSet,pizzasDataSet[pizzaName] == id, atLeastOneCheckboxIsChecked(".checkbox-update"))
        console.log(pizzasDataSet);
        cancelPizza();
        if(pizzaName.length > 0 && (!(pizzaName in pizzasDataSet) ||  pizzasDataSet[pizzaName] == id) && atLeastOneCheckboxIsChecked(".checkbox-update")){
            var checkedBoxes = document.querySelectorAll('input[class=checkbox-update]:checked');
            toppingID = [];
            for (let index = 0; index < checkedBoxes.length; index++) {
                toppingID.push(checkedBoxes[index].value) 
            }

            console.log(toppingID)
            const data = JSON.stringify({
                "pizzaid": id,
                "pizzaname": pizzaName,
                "toppingid": toppingID
            });

            console.log(data);
            const fetchOptions = {
                method : 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body : data
            };
            var url = "https:/dark-teal-cygnet-tux.cyclic.app/updatepizza";

		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Pizza Successfully updated!");
                    location.reload();
            
                }
			})
			.catch(function(error) {
				console.log(error);
   		});


        document.getElementsByClassName("main")[0].style.opacity = "1";
        }
        else{
            alert("Pizza Invalid");
        }
    }


    function atLeastOneCheckboxIsChecked(classname){
        const checkboxes = Array.from(document.querySelectorAll(classname));
        return checkboxes.reduce((acc, curr) => acc || curr.checked, false);
    }
    

    function newPizza(){
        var pizzaName = document.getElementsByClassName("pizza-name")[0].value;
        cancelPizza();
        if(pizzaName.length > 0 && !(pizzaName in pizzasDataSet) && atLeastOneCheckboxIsChecked(".checkbox")){
            var checkedBoxes = document.querySelectorAll('input[class=checkbox]:checked');
            toppingID = [];
            for (let index = 0; index < checkedBoxes.length; index++) {
                toppingID.push(checkedBoxes[index].value) 
            }

            console.log(toppingID)
            const data = JSON.stringify({
                "pizzaname": pizzaName,
                "toppingid": toppingID
            });

            console.log(data);
            const fetchOptions = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body : data
            };
        var url = "https:/dark-teal-cygnet-tux.cyclic.app/pizza";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Pizza Successfully added!");
                    location.reload();
            
                }
			})
			.catch(function(error) {
				console.log(error);
   		});

        }
        else{
            alert("Pizza Invalid");
        }


        document.getElementsByClassName("main")[0].style.opacity = "1";
    }

    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            console.log(response);
            return response.text();

        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        }
    }




})();
