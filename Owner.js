(function(){

    var toppingsDataSet = new Set();

    window.onload = function() {
        allToppings();
		
	};

    function allToppings(){
        var url = "https:/dark-teal-cygnet-tux.cyclic.app//toppings";
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {   
                    response = JSON.parse(responseText);
                    for (var i = 0; i < response["Toppings"].length; i++) {
                        toppingsDataSet.add(response["Toppings"][i]["ToppingName"]);
                        var temp = response["Toppings"][i]["ToppingName"];
                        var div = document.createElement('div'); // Create Div
                        div.className = "toppings";
                        div.id = response["Toppings"][i]["ToppingID"];
                        div.setAttribute("name", response["Toppings"][i]["ToppingName"]);
                        var para = document.createElement('p'); // Create Paragragh
                        para.innerText = response["Toppings"][i]["ToppingName"];
                        div.appendChild(para);
                        var deletebtn = document.createElement('button'); // Create Delete Button
                        deletebtn.className = "delete-button";
                        deletebtn.innerText = "Delete";
                        div.appendChild(deletebtn);
                        deletebtn.onclick = function(event){deleteTopping(event.target.parentNode.id)};
                        var updatebtn = document.createElement('button'); // Create Edit Button
                        updatebtn.className = "update-button";
                        updatebtn.innerText = "Update";
                        updatebtn.onclick = function(event){editTopping(event.target.parentNode.id)};
                        div.appendChild(updatebtn);
                        document.getElementsByClassName("main")[0].appendChild(div);
                        
                    }

                    document.getElementsByClassName("new")[0].onclick = addTopping;
                    
                    document.getElementsByClassName("cancel")[0].onclick = cancelTopping;
                    document.getElementsByClassName("cancel")[1].onclick = cancelUpdate;
                    document.getElementsByClassName("cancel")[2].onclick = cancelDelete;
                    document.getElementsByClassName("add")[0].onclick = newTopping;
                })
                .catch(function(error) {
                    console.log(error);
            });
        
        
    }

    function addTopping(){
        document.getElementsByClassName("add-new")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5"
    }


    function cancelTopping(){
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

    function deleteTopping(id) {
        toppingID = id;

        document.getElementsByClassName("delete")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5"

        document.getElementsByClassName("yes")[0].onclick = function(){deleteToppingConfirmed(toppingID)};

    }


    function editTopping(id) {
        toppingID = id;

        document.getElementsByClassName("update")[0].style.display = "block";
        document.getElementsByClassName("main")[0].style.opacity = ".5"

        document.getElementsByClassName("update-topping")[0].onclick = function(){updateTopping(toppingID)};

    }


    function deleteToppingConfirmed(id){
        toppingID = id;

        cancelTopping();
        
        const data = JSON.stringify({
            "toppingID": id,
        });

        const fetchOptions = {
            method : 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body : data
        };
        var url = "https:/dark-teal-cygnet-tux.cyclic.app//deletetopping";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Topping Successfully deleted!");
                    location.reload();
            
                }

                else{
                    alert("Topping Invalid for Update");
                }
			})
			.catch(function(error) {
				console.log(error);
   		});
        document.getElementsByClassName("main")[0].style.opacity = "1";
    }

    function updateTopping(id){
        toppingID = id;
        toppingName = document.getElementById(id).getAttribute("name");
        console.log(toppingID, toppingName)

        var newToppingName = document.getElementsByClassName("update-name")[0].value;
        cancelTopping();
        // newtoppingName length greater than 0, not in dataset and not equal to previous name
        if(newToppingName.length > 0 && !toppingsDataSet.has(newToppingName) && newToppingName != toppingName){
            const data = JSON.stringify({
                "toppingID": id,
                "newtoppingname": newToppingName
            });

            const fetchOptions = {
                method : 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body : data
            };
            var url = "https:/dark-teal-cygnet-tux.cyclic.app//updatetopping";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Topping Successfully updated!");
                    location.reload();
            
                }
			})
			.catch(function(error) {
				console.log(error);
   		});

        }
        else{
            alert("Topping Invalid for Update");
        }


        document.getElementsByClassName("main")[0].style.opacity = "1";
    }

    

    function newTopping(){
        var toppingName = document.getElementsByClassName("topping-name")[0].value;
        cancelTopping();
        if(toppingName.length > 0 && !toppingsDataSet.has(toppingName) ){
            const data = JSON.stringify({
                "toppingname": toppingName
            });

            const fetchOptions = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body : data
            };
            var url = "https:/dark-teal-cygnet-tux.cyclic.app//topping";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
                response = JSON.parse(responseText)
				console.log(response);	
                var status = response["Result"];
				console.log(responseText);	
                
                if(status = "Success"){
                    alert("Topping Successfully added!");
                    location.reload();
            
                }
			})
			.catch(function(error) {
				console.log(error);
   		});

        }
        else{
            alert("Topping Invalid");
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