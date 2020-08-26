(function ($) {

    function remove_spaces(str) {
        return str.trim().replace(/\s/g, '+').replace(/\./g, '');
    }

    function valid_credit_card(value) {
        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        value      = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    let global_actions = {
        select_product_price: function () {
            let hash = document.location.hash;
            if (hash.indexOf('#PP') !== -1) {
                let pp = hash.replace('#PP', '');
                $('.uk-radio').eq(pp - 1).prop('checked', true);
            }
        },
        switcher_change:      function () {
            $(document).on('click', '.change-wizzard', function (e) {
                if ($(this).hasClass('confirmations')) {

                    let error = false;

                    if ($('[name="payment"][value="cc"]').is(':checked')) {

                        if (
                            $('#cc_owner').val() == '' ||
                            $('#cc_number_nh-dns').val() == ''
                        ) {
                            error = 'Please fill in your Credit Card Owner and Number details!';
                        }

                        if (!valid_credit_card($('#cc_number_nh-dns').val())) {
                            error = 'Your Credit Card number is not valid, please try again!';
                        }

                    } else {

                        if (
                            $('#po_owner').val() == '' ||
                            $('#po_number-dns').val() == ''
                        ) {
                            error = 'Please fill in your PO Company Name and Number details!';
                        }

                    }

                    if (error !== false) {
                        $('.change-wizzard.confirmations').removeClass('uk-active');
                        $('.change-wizzard.payments').addClass('uk-active');

                        $('.tab-confirmation').removeClass('uk-active');
                        $('.tab-payments').addClass('uk-active');

                        UIkit.notification({message: error, status: 'danger'})
                    }

                }
            });
        },
        scroll_to:            function () {
            $(document).on('click', '.scroll-to', function (e) {
                e.preventDefault();

                UIkit.scroll($(this).data('target'), {offset: 85});

            });
        },
        text_copy:            function () {
            $(document).on('click', '.text-copy', function (e) {
                e.preventDefault();

                let el   = document.createElement('textarea');
                el.value = $(this).text().replace(/\./g, '').replace(/\+/g, '');
                document.body.appendChild(el);
                el.select();

                try {
                    // Now that we've selected the anchor text, execute the copy command
                    let successful = document.execCommand('copy');
                    if (successful) {
                        UIkit.notification('Successfully copied text to clipboard!');
                    } else {
                        UIkit.notification('Failed to copy text to clipboard! Please press CTRL + C if you are on Windows or ⌘ + C if you are on Mac.');
                    }
                } catch (err) {
                    UIkit.notification('Failed to copy text to clipboard! Please press CTRL + C if you are on Windows or ⌘ + C if you are on Mac.');
                }

                document.body.removeChild(el);

            });
        },
        show_prices:          function () {
            $(document).on('click', '.show-more-prices', function (e) {
                e.preventDefault();
                var prices = $(this).prev('.more-prices');
                if (!prices.hasClass('uk-hidden')) {

                    $(this).html('<i class=\'fa fa-caret-down\'></i> More Sizes/Prices');
                    prices.addClass('uk-hidden');

                } else {

                    $(this).html('<i class=\'fa fa-caret-up\'></i> Less Sizes/Prices');
                    prices.removeClass('uk-hidden');

                }
            });
        },
        search:               function () {
            $(document).on('click', '.global-search .uk-search-icon.uk-icon', function (e) {
                e.preventDefault();
                document.location.href = '/search/' + remove_spaces($(this).next('.global-search-input').val());
            });
            $(document).on('submit', '.global-search', function (e) {
                e.preventDefault();
                document.location.href = '/search/' + remove_spaces($(this).find('.global-search-input').val());
            });
            $(document).on('submit', '.advanced-search-form', function (e) {
                e.preventDefault();

                var data      = $(this).serializeArray();
                var url_array = [];
                var keyword   = '';

                for (var i = 0; i < data.length; i++) {

                    var obj = data[i];
                    if (obj.name == 'keywords') {
                        keyword = obj.value;
                    } else {
                        url_array.push(obj.name + ':' + remove_spaces(obj.value));
                    }

                }

                document.location.href = '/search/' + remove_spaces(keyword) + '/' + url_array.join(';');
            });
        },
        info_buttons:         function () {
            $(document).on('click', '.info-card-button', function (e) {
                e.preventDefault();
                let target = $(this).data('target');
                $('.info-cards').hide();
                $(target).show();

            });
        },
        quote_button:         function () {
            $(document).on('click', '.uk-button-quote', function (e) {
                e.preventDefault();

                var model = $(this).data('model');
                var modal = UIkit.modal("#uk-modal-quote");

                $('[for="inquiry"]').html('Your Inquiries, Comments or Full Shipping Address <span class="uk-text-danger"><b>(required)</b></span>');
                $('[name="inquiry"]').attr('required', 'required');

                $('#uk-modal-quote .catalog_num').text(model);
                $('#uk-modal-quote #catalog_num').val(model);

                modal.show();
            });
            $(document).on('submit', '.uk-form-quote', function (e) {
                e.preventDefault();

                var button = $(this).find('.uk-button-primary');
                button.disable();

                $.post('/datasheet-quote', $(this).serialize(), function (d) {

                    var modal = UIkit.modal("#uk-modal-quote");
                    button.disable();

                    if (d.status != 'success') {
                        UIkit.notification({message: d.message, status: 'danger'});
                        document.location.reload();
                    } else {
                        $('input.noonce').attr('name', d.noonce[0]);
                        $('input.noonce').val(d.noonce[1]);
                        UIkit.notification({message: d.message, status: 'primary'});
                        modal.hide();
                    }

                }, 'json');

            });
        },
        inquire_button:       function () {
            $(document).on('click', '.uk-button-inquire', function (e) {
                e.preventDefault();

                var model = $(this).data('model');
                var modal = UIkit.modal("#uk-modal-inquire");

                if (typeof $(this).data('title') != 'undefined') {
                    $('#uk-modal-inquire .uk-modal-title').html('<i class="fa fa-life-ring"></i> ' + $(this).data('title'));
                } else {
                    $('#uk-modal-inquire .uk-modal-title').html('<i class="fa fa-life-ring"></i> Contact Us');
                }

                if (typeof $(this).data('require') != 'undefined') {
                    $('[for="inquiry"]').html('Your Inquiries or Comments <span class="uk-text-danger"><b>(required)</b></span>');
                    $('[name="inquiry"]').attr('required', 'required');
                } else {
                    $('[for="inquiry"]').html('Your Inquiries or Comments');
                    $('[name="inquiry"]').removeAttr('required');
                }


                $('#uk-modal-inquire .catalog_num').text(model);
                $('#uk-modal-inquire #catalog_num').val(model);

                if (typeof $(this).data('type') != 'undefined') {
                    $('#uk-modal-inquire #inquiry_type').attr('name', $(this).data('type'));
                    $('#uk-modal-inquire #inquiry_type').val('true');
                } else {
                    $('#uk-modal-inquire #inquiry_type').attr('name', 'null');
                    $('#uk-modal-inquire #inquiry_type').val('');
                }

                modal.show();
            });
            $(document).on('submit', '.uk-form-inquire', function (e) {
                e.preventDefault();

                var button = $(this).find('.uk-button-primary');
                button.disable();

                $.post('/datasheet-ask', $(this).serialize(), function (d) {

                    var modal = UIkit.modal("#uk-modal-inquire");
                    button.disable();

                    if (d.status != 'success') {
                        UIkit.notification({message: d.message, status: 'danger'});
                        document.location.reload();
                    } else {
                        $('input.noonce').attr('name', d.noonce[0]);
                        $('input.noonce').val(d.noonce[1]);
                        UIkit.notification({message: d.message, status: 'primary'});
                        modal.hide();
                    }

                }, 'json');

            });
        },
        ajax_action:          function () {
            $(document).on('click', '.ajax-action', function (e) {
                e.preventDefault();

                var arguments = $(this).data('arguments');

                $.post(window.location, arguments, function (d) {
                    if (d.status != 'success') {
                        UIkit.notification({message: d.message, status: 'danger'});
                    } else {
                        UIkit.notification({message: d.message, status: 'primary'});
                        document.location.reload();
                    }

                }, 'json');

            });
        },
        show_matching_pairs:  function () {
            $(document).on('click', '.show_more_pairs_button', function (e) {
                e.preventDefault();
                let el = $('.show_more_pairs');
                if (el.is(':visible')) {
                    $(this).html('<i class="fas fa-caret-down"></i> Show more Matching Pairs');
                    el.hide();
                } else {
                    $(this).html('<i class="fas fa-caret-up"></i> Show less Matching Pairs');
                    el.show();
                }
            });
        }
    };

    $(document).ready(function () {

        $(document).on("keypress", "form.checkout", function (event) {
            return event.keyCode != 13;
        });

        global_actions.select_product_price();
        global_actions.switcher_change();
        global_actions.scroll_to();
        global_actions.text_copy();
        global_actions.search();
        global_actions.info_buttons();
        global_actions.inquire_button();
        global_actions.quote_button();
        global_actions.ajax_action();
        global_actions.show_prices();
        global_actions.show_matching_pairs();

    });

})(jQuery);

jQuery.fn.extend({
    // Disable Element
    disable: function (message) {
        return this.each(function () {
            var i = jQuery(this).find('i');
            if (typeof jQuery(this).attr('disabled') == 'undefined') {
                if (i.length > 0) {
                    i.attr('class-backup', i.attr('class'));
                    i.attr('class', 'fa fa-spinner fa-spin');
                }
                if (typeof message != 'undefined') {
                    jQuery(this).attr('text-backup', jQuery(this).text());
                    jQuery(this).text(' ' + message);
                    jQuery(this).prepend(i);
                }
                jQuery(this).attr('disabled', 'disabled');
            } else {
                jQuery(this).removeAttr('disabled');
                if (i.length > 0) i.attr('class', i.attr('class-backup'));
                if (typeof jQuery(this).attr('text-backup') != 'undefined') {
                    jQuery(this).text(' ' + jQuery(this).attr('text-backup'));
                    jQuery(this).prepend(i);
                }
            }
        });
    }
});