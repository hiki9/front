const edition = {};
edition.drugs = [];
edition.pharmacies = [];
edition.buttonEdit = jQuery("#button-edit");
edition.buttonEditP = jQuery("#button-editP");
edition.buttonCancelEdit = jQuery("#button-cancel-edit");
edition.init = async () => {
  edition.pharmacies = await edition.getPharmacies();
  edition.fillSelectePharmacies(edition.pharmacies);
};

edition.fillSelectePharmacies = (pharmacies) => {
  const select = jQuery('#pharmacie');
  select.append(pharmacies.map(pharmacie => {
    return `<option value="${pharmacie.id}">${pharmacie.name}</option>`;
  })
  );
};

edition.getPharmacies = () => {
  return jQuery
    .ajax({
      url: `https://yvonapi.herokuapp.com/api/pharmacies`,
      method: "GET",
    })
    .catch((error) => {
      console.warn(error);
      return [];
    });
};

edition.showForm = (drugId) => {
  edition.cleanForm();
  if (drugId) {
    edition.populate(drugId);
  }
  jQuery("#container-form").fadeIn();
  jQuery("#container-formP").fadeOut();
  jQuery("#list-pharmacies").fadeOut();
  jQuery("#list-drugs").fadeOut();
  edition.buttonEdit.hide();
  edition.buttonCancelEdit.show();
};

edition.showFormP = (pharmacieId) => {
  edition.cleanFormP();
  if (pharmacieId) {
    edition.populateP(pharmacieId);
  }
  jQuery("#container-formP").fadeIn();
  jQuery("#container-form").fadeOut();
  jQuery("#list-pharmacies").fadeOut();
  jQuery("#list-drugs").fadeOut();
  edition.buttonEdit.hide();
  edition.buttonEditP.hide();
  edition.buttonCancelEdit.show();
};

edition.populate = (drugId) => {
  const drug = list.drugs.find((drug) => drug.id === drugId);
  if (drug) {
    jQuery("#id").val(drug.id);
    jQuery("#pharmacie").val(drug.pharmacie_id);
    jQuery("#nom").val(drug.nom);
  }
};

edition.populateP = (pharmacieId) => {
  const pharmacie = list.pharmacies.find((pharmacie) => pharmacie.id === pharmacieId);
  if (pharmacie) {
    
    jQuery("#id").val(pharmacie.id);
    jQuery("#name").val(pharmacie.name);
  }
};

edition.cleanForm = () => {
  jQuery("#id").val("");
  jQuery("#pharmacie").val("");
  jQuery("#nom").val("");
};

edition.cleanFormP = () => {
  jQuery("#id").val("");
  jQuery("#name").val("");
  
};

//Annuler et retour à l'accueil
edition.cancelForm = () => {
  window.location.href = "/";
};

edition.hideForm = () => {
  jQuery("#container-form").hide();
  jQuery("#container-formP").hide();
  jQuery("#list-drugs").fadeIn();
  jQuery("#list-pharmacies").fadeOut();
  edition.buttonEdit.show();
  edition.buttonEditP.show();
  edition.buttonCancelEdit.hide();
};

edition.hideFormP = () => {
  jQuery("#container-form").hide();
  jQuery("#container-formP").hide();
  jQuery("#list-drugs").fadeOut();
  jQuery("#list-pharmacies").fadeIn();
  edition.buttonEdit.show();
  edition.buttonEditP.show();
  edition.buttonCancelEdit.hide();
};

edition.getFormError = () => {
  $('.error-msg').hide();
  let errors = 0;
  if ($('#pharmacie').val() == null) {
    $('#pharmacie-required').show();
    errors++;
  }


  if ($('#nom').length = 0) {
    $('#nom-required').show();
    errors++;
    
  }

  return errors;
};
edition.getFormErrorP = () => {
  $('#name-required').hide();
  $('.error-msgP').hide();
  let errors = 0;
 
  if ($('#name').val() == ''){
    $('#name-required').show();
    errors++;
  }
     return errors;
   
  };



edition.save = async (event) => {
  event.preventDefault();

  const countError = edition.getFormError();

  if (countError > 0) {
    return;
  }

  $('#alert-error-drug').empty().hide;
  const id = jQuery("#id").val();
  const isEdition = id.length > 0;
  const pharmacie_id = jQuery("#pharmacie").val();
  const nom = jQuery("#nom").val();
  let url = `https://yvonapi.herokuapp.com/api/drugs`;

  if (isEdition) {
    url += `/${id}`;
  }
  try {
    const newDrug = await jQuery.ajax({
      url,
      method: "POST",
      data: {
        pharmacie_id,
        nom,
      },
    });

    if (isEdition) {
      list.init();
    } else {
      list.importDrugsInTable([newDrug]);
      list.drugs.push(newDrug);
      alert('Ajout réalisé! appuyer sur acceuil pour revenir au menu  précédant');
    }
    edition.hideForm();
  } catch (error) {
    if (error.responseJSON && error.responseJSON.error) {
      $('#alert-error-drug').append(error.responseJSON.error).show();
    }
    console.error(error);
  }
 // window.location.href = "/";
};


edition.saveP = async (event) => {
  event.preventDefault();

  const countError = edition.getFormErrorP();

  if (countError > 0) {
    return;
  }

  $('#alert-error-pharmacie').empty().hide;
  const id = jQuery("#id").val();
  const isEdition = id.length > 0;
  const name = jQuery("#name").val();
  let url = `https://yvonapi.herokuapp.com/api/pharmacies`;

  if (isEdition) {
    url += `/${id}`;
  }
  try {
    const newPharmacie = await jQuery.ajax({
      url,
      method: "POST",
      data: {
       
        name,
      },
    });

    if (isEdition) {
      list.init();
    } else {
      list.importPharmaciesInTable([newPharmacie]);
      list.pharmacies.push(newPharmacie);
      alert('ok! appuyer sur acceuil');
      
    }
    edition.hideForm();
  } catch (error) {
    if (error.responseJSON && error.responseJSON.error) {
      $('#alert-error-pharmacie').append(error.responseJSON.error).show();
    }
    console.error(error);
  }
 // window.location.href = "/";
};


edition.init();