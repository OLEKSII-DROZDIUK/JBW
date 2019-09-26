$(function () {
//for hide #promo when click x
    const promo = $('.promo');

    $("#close-propmo").bind("click",function(){    
        promo.addClass('is-close');
        setTimeout(function () {
            promo.addClass('is-novisible');
          }, 2000);
    });

//Calculete the Price form
    const orderPrice = new Price();
    const plusCount = $('.btn-plus');
    const minusCount = $('.btn-minus');
    const countValue  = $('.input-counter');
    const formLvl = $(".form-lvl");
    const spanPrice = $(".span-price");
    
    class Price {
        constructor(){
            this.price = 5;
            this.lvl = 5;
            this.count = 1;
        }

        plus(){
            this.count = new Number(this.count + 1);
            this.price = (this.lvl * this.count).toFixed(2);
            this.recalculate();
        }

        minus(){
            this.count = new Number(this.count - 1)
            this.price = (this.lvl * this.count).toFixed(2)
            this.recalculate();
        }

        takePrice(){
            return this.price;
        }

        setLvl(lvl){
            this.lvl = lvl;
            this.recalculate();
        }

        changeCount(newCount){
            this.count = new Number(newCount);
            this.recalculate();
        }

        recalculate(){
            this.price = (this.lvl * this.count).toFixed(2);
            countValue.val(this.count);
            spanPrice.text(this.price);
        }
    }

    plusCount.bind('click', function(){
        orderPrice.plus();
    });

    minusCount.bind('click', function(){
        orderPrice.minus();
    });

    countValue.on("change paste keyup", function() {
        if($.isNumeric(countValue.val())){
            orderPrice.changeCount(countValue.val())
        }else if(countValue.val() != '' && !$.isNumeric(countValue.val())){
            countValue.val(1)
        }
    })

    formLvl.change(function(){

        switch (formLvl.val()){
            case "Light":
               orderPrice.setLvl(5);
               break;
            case "Middle":
               orderPrice.setLvl(8.5);
               break;
            case "Hardcore":
               orderPrice.setLvl(10.99);
               break;
        }
    })

//popup hide/show
    const btnPopup = $('.btn-popup');
    const windowPopUp = $('#popUp');
    const closePopUp = $('#close-popUp');
    const popUpForm = $('.popUp-form');

    btnPopup.bind('click', function(event){
        selectCountries.val("");
        windowPopUp.css('display','block');
    });

    closePopUp.bind('click', function(){
        windowPopUp.css('display','none');
    });

    $(document).bind('click', function (e){ 
		if (!popUpForm.is(e.target) 
		    && popUpForm.has(e.target).length === 0 && !$(e.target).hasClass("btn-popup")) { 
                windowPopUp.css('display','none');
		}
    });

//popup select
    const selectCountries = $('#countries');
    const formForPhone =  $('.form-phone');
    const formForEmail = $('.form-email');
    const formForName = $('.form-name');

    selectCountries.bind('click', function(event){
        switch(event.target.value){
            case "Ukraine":
                selectCountries.removeClass("countries-cuba countries-bel");
                selectCountries.addClass("countries-ukr");
                formForPhone.attr("placeholder", "+ 38");
                break;
            case "Belarus":
                selectCountries.removeClass("countries-cuba countries-ukr");
                selectCountries.addClass("countries-bel");
                formForPhone.attr("placeholder", "+ 375");
                break;
            case "Cuba":
                selectCountries.removeClass("countries-bel countries-ukr");
                selectCountries.addClass("countries-cuba");
                formForPhone.attr("placeholder", "+ 53");
                break;
        }
        selectCountries.val("");   
    });

    formForName.on('keypress', function() {
        var that = this;

        setTimeout(function() {
            const res = /[^а-яА-ЯїЇєЄіІёЁҐґ\- ’'‘"()]/g.exec(that.value); //непонятно какие именно символы оставлять, сотавил более логичные для имени и фамилии
            that.value = that.value.replace(res, '');
        }, 0);
    });

    formForPhone.keypress(function(event){
        event = event || window.event;
        
        if (event.charCode && event.charCode != 0 && (event.charCode < 48 || event.charCode > 57))
            return false;
    })

//validation form
    const submitPopUp = $('.form_submit');
    const phoneErr = $('.phone-error-message');
    const nameErr = $('.name-error-message');
    const emailErr = $('.email-error-message');
    const sendForm = $('#popUp2');

    function validatePhone (phone) {
        if (phone.length === 0) {
          return 'Это поле обязательно для заполнения';
        }
        if (phone.length < 10) {
          return 'Пожалуйста, введите 10 или более цифр';
        }
        return 'ok';
    }

    function validateEmail (email) {
        if (email.length === 0) {
          return 'Это поле обязательно для заполнения';
        }
        const pattern = /^[a-z0-9_.-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
        if (email.search(pattern) === -1) {
          return 'Поле email не соответствует формату';
        }
        return "ok";
    }

    function validateName(name) {
        if (name.length === 0) {
            return 'Это поле обязательно для заполнения';
        }
        if (name.length < 3) {
            return 'Пожалуйста, введите 3 или более символов.';
        }
        return 'ok';
    }

    submitPopUp.on('click', function(){

        if(validatePhone(formForPhone.val()) === "ok" 
            && validateName(formForName.val()) === "ok" 
            && validateEmail(formForEmail.val()) === "ok") {
            const clientObj = JSON.stringify({email:formForEmail.val(), name:formForName.val(), phone:formForPhone.val(), lvlProduct:formLvl.val(), price:orderPrice.takePrice()});

            event.preventDefault()
            $.ajax({
                type:'POST',
                url: 'http://localhost:5000/file/add',
                data:{
                    clientObj
                },
                success: function(){
                    nameErr.text("");
                    phoneErr.text("");
                    emailErr.text("");
                    formForEmail.val("");
                    formForName.val("");
                    formForPhone.val("")
                    windowPopUp.css('display','none');
                    sendForm.css('display','block');
                    
                },
                error: function(err){
                    console.log(err);
                }
            });
    
        } else {
            emailErr.text(validateEmail(formForEmail.val()) === "ok"?"":validateEmail(formForEmail.val()));
            nameErr.text(validateName(formForName.val())=== "ok"?"":validateName(formForName.val()));
            phoneErr.text(validatePhone(formForPhone.val())=== "ok"?"":validatePhone(formForPhone.val())); 
        }
    })
//close send form
    $('.send-form_btn, #close-popUp2').click(function() { 
        sendForm.css('display','none');
    })

}(jQuery));