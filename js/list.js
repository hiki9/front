const list = {};
list.drugs = [];
list.pharmacies = [];
list.drugToRemove = null;

list.init = async () => {
  list.drugs = await list.getDrugs();
  list.pharmacies = await list.getPharmacies();
  list.importDrugsInTable(list.drugs, true);
  list.importPharmaciesInTable(list.pharmacies, true);

  
};

list.getDrugs = () => {
  return jQuery
    .ajax({
      url: "https://yvonapi.herokuapp.com/api/drugs",
      method: "GET",
    })
    .catch((error) => {
      console.warn(error);
      return [];
    });
};

list.getPharmacies = () => {
  return jQuery
    .ajax({
      url: "https://yvonapi.herokuapp.com/api/pharmacies",
      method: "GET",
    })
    .catch((error) => {
      console.warn(error);
      return [];
    });
};


list.confirmRemove = (drugId) => {
  list.drugToRemove = drugId;
  jQuery("#remove-line-modal").modal("toggle");
};

list.confirmRemoveP = (pharmacieId) => {
  list.pharmacieToRemove = pharmacieId;
  jQuery("#remove-line-modalP").modal("toggle");
};


list.remove = async () => {
  const drugId = list.drugToRemove;
  try {
    await jQuery.ajax({
      url: `https://yvonapi.herokuapp.com/api/drugs/${drugId}`,
      method: "DELETE",
    });
    jQuery(`[data-id="${drugId}"]`).fadeOut("slow");
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue impossible de supprimer le médicament.");
  } finally {
    jQuery("#remove-line-modal").modal('hide');
  }
};

list.removeP = async () => {
  const pharmacieId = list.pharmacieToRemove;
  try {
    await jQuery.ajax({
      url: `https://yvonapi.herokuapp.com/api/pharmacies/${pharmacieId}`,
      method: "DELETE",
    });
    jQuery(`[data-id="${pharmacieId}"]`).fadeOut("slow");
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue impossible de supprimer la pharmacie.");
  } finally {
    jQuery("#remove-line-modalP").modal('hide');
  }
};

list.importDrugsInTable = (drugs, clear) => {
  const tbody = jQuery("#list-drugs tbody");
  if (clear === true) {
    tbody.empty();
  }
  tbody.append(
    drugs.map((drug) => {
      return `
    <tr data-id="${drug.id}" id="anim1" >
        <td>${drug.id}</td>
        <td>${drug.pharmacie_name}</td>
        <td>${drug.nom}</td>
        <td>
          <button onclick="list.confirmRemove(${drug.id})" class="btn btn-danger remove-line">Supprimer</button>
          <button onclick="edition.showForm(${drug.id})" class="btn btn-primary remove-line">Modifier</button>
        </td>
    </tr>
    `;
    })
  );
};


list.importPharmaciesInTable = (pharmacies, clear) => {
  const tbody = jQuery("#list-pharmacies tbody");
  if (clear === true) {
    tbody.empty();
  }
  tbody.append(
    pharmacies.map((pharmacie) => {
      return `
    <tr data-id="${pharmacie.id}" id="anim1">
        <td>${pharmacie.id}</td>
        <td>${pharmacie.name}</td>
        <td>
          <button onclick="list.confirmRemoveP(${pharmacie.id})" class="btn btn-danger remove-line">Supprimer</button>
          <button onclick="edition.showFormP(${pharmacie.id})" class="btn btn-primary remove-line">Modifier</button>
        </td>
    </tr>
    `;
    })
  );
};



let tr = document.querySelector('tr');
tr.addEventListener('mouseover', function(){
  tr.style.color = "green";
  tr.style.background = "purple" 
});
tr.addEventListener('mouseout', function(){
  tr.style.color = "black";
  tr.style.background = "none";
});

/*var granimInstance = new Granim({
  element: '#granim-canvas',
  name: 'granim',
  opacity: [1, 1],
  states : {
      "default-state": {
          gradients: [
              ['#834D9B', '#D04ED6'],
              ['#1CD8D2', '#93EDC7']
          ]
      }
  }
});*/
list.init();