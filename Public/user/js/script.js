// function addToCart(proId){
    // console.log(proId);
    // $.ajax({
    //     url:'/addtocart',
    //     method:'post',
    //     data:{
    //         Id:proId
    //     },
    //     success:(response)=>{
            // console.log(res.cout)
            // if(response.cout){
            //     let count=response.cout
                // let exist1=response.exist
                // console.log(exist1)
                // console.log(count)
//                 $("#cart_count").html(count)
//             }
//         }
//     })
// }
function add_to_cart(proId){
    $.ajax({
        url:'/add_to_cart',
        method:'post',
        data: {
            Id:proId
        },
        success:(response)=>{
            if(response.exist){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Product Already in Cart..!',
                        showConfirmButton: false,
                        timer: 1500
                    // title: "Product Already in Wishlist..!",
                    // icon: "warning",
                    // confirmButtonText: false,
                    // timer: 1000
                //   }).then(function () {
                //     location.reload();
                  });
                
                }
                if(response.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'product add successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      let count=response.count
                      $("#cart_count").html(count)

                }
                if(response.outofStock){
                    Swal.fire({
                        position: 'center',
                            icon: 'warning',
                            title: 'Sorry,Product Out of Stock..!',
                            showConfirmButton: false,
                            timer: 1500
                       
                      });
                    
                    }        
        }
    })
}



function addQty(proId,position){
    $.ajax({
        url:'/productadd',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)+1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)+price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)+price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Limit Exist..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            }
        }
    )

}


function subQty(proId,position){
    $.ajax({
        url:'/productsub',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)-1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)-price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)-price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Limit Exist..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            }
        }
    )

}


function addToWishlist(id){
    // console.log(id);
    $.ajax({
        url:'/addTowishlist',
        method:'post',
        data : {
            prodId : id
        },
       
        success:(response)=>{
            if(response.wish){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Product Already in Wishlist..!',
                        showConfirmButton: false,
                        timer: 1500
                    // title: "Product Already in Wishlist..!",
                    // icon: "warning",
                    // confirmButtonText: false,
                    // timer: 1000
                //   }).then(function () {
                //     location.reload();
                  });
                
                }
                if(response.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'product add successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      let count=response.count
                      $("#wishlist_count").html(count)

                }
          
        }
    })
    // console.log(data);

}

function setaddress(id){
    $.ajax({
        url:'/setaddress',
        method:'post',
        data : {
            addresId : id
        },
        success:(response)=>{
            console.log(response.data);
            $("#adres_name").val(response.data[0].name);
            $("#adres_line1").val(response.data[0].addressline1);
            $("#adres_line2").val(response.data[0].addressline2);
            $("#adres_district").val(response.data[0].district);
            $("#adres_state").val(response.data[0].state);
            $("#adres_country").val(response.data[0].country);
            $("#adres_pin").val(response.data[0].pin);
            $("#adres_mobile").val(response.data[0].mobile);
            
            }

    })
}

// $('select').on('change', function() {
//     alert( this.value );
//   });

// function couponCheck(){
    // document.getElementById('coupon_button').addEventListener('click', function() {
        // var inputValue = document.getElementById('couponCode').value;
        // console.log(inputValue);
    //   });
    // $.ajax({
    //     url:'/coupon_check',
    //     method:'patch',
    //     data : {
    //         couponCode : $("#couponCode").val(),
            // value: inputValue
//         },
//     })
// }

// $("#coupon_button").click(function() {
//     // get the value of the input field
//     var inputValue = $("#couponCode").val();

//     // create an AJAX request
//     $.ajax({
//       type: "post",
//       url: "/coupon_check",
//       data: { input: inputValue },
//       success: function(response) {
//         // update the page with the response
//         // $("#response").html(response);
//       }
//     });
//   });

  $("#coupon_button").click(function(event) {
    // prevent the form from being submitted
    event.preventDefault();
  
    // get the value of the input field
    var inputValue = $("#couponCode").val();
  
    // create an AJAX request
    $.ajax({
      type: "post",
      url: "/coupon_check",
      data: { input: inputValue,total:$('#total').html() },
      success: function(response) {
        if(response.couponApplied){
        $('#message').html('Coupon Applied').css('color', 'green');
        let discount=response.couponApplied.discount
        let code=response.couponApplied.code
        let couponId=response.couponApplied._id
        let total=$('#total').html()
        let subtotal=$('#subtotal').html()
        discount=parseInt(discount)
        total=parseInt(total)
        let discountedPrice=(discount*total)/100
        total=total-discountedPrice
        $('#total').html(total)
        $('#coupon_code').html(code)
        $('#couponId').val(couponId)
        $('#total_amount').val(total)
        }
        if(response.notExist){
            $('#message').html('Coupon Not Found!!').css('color', 'red');
            }
        if(response.expired){
           $('#message').html('Coupon Expired!!').css('color', 'red');  
            }
        if(response.userUsed){
            $('#message').html('Coupon Already Used!!').css('color', 'red');  
        }
        if(response.minAmount){
            let minAmount=response.minAmount
            $('#message').html('Minimum '+minAmount+' required!!').css('color', 'red');  
        }
        // update the page with the response
        // $("#response").html(response);
      }
    });
  });
  

//   function payment(){
//     console.log(req.body);
//     $.ajax({
//         url:'/checkout',
//         method:'post',
//         data :{

//         }
//     })
//   }

$(document).ready(function() {
    $('#myForm').submit(function(e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/checkout',
            data: formData,
            success:  (response) => {
                if (response.fail) {
                    location.href = "/payment_fail";
                  }
                  else if(response.codSuccess){
                    location.href = "/payment_succuss";
                  } else {
                    // console.log(response.order);
                    // console.log(response.orderDetails);
                    let order=response.order
                    let orderDetails=response.orderDetails
                    razorPay(order,orderDetails);
                  }
            }
        });
    });
});

function razorPay(order,orderDetails){
var options = {
    "key": "rzp_test_pTxoFkiwXZuGgu", // Enter the Key ID generated from the Dashboard
    "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "TechKart",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
        verifyPayment(response, order,orderDetails)
    },
    "prefill": {
        "name": "Abdulla",
        "email": "sapabdu@gmail.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        location.href = "/payment_fail";
});
rzp1.open()

}


function verifyPayment(payment, order,orderDetails) {
    // console.log(payment)
    // console.log(order)

    $.ajax({
        url: "/verifyPayment",
        data: {
            payment,
            order,
            orderDetails
        },
        method: "post",
        success: (response) => {
            if (response.success) {
                location.href = "/payment_succuss";
            } else {
                location.href = "/payment_fail";
            }
        },
    });
}
//   function verifyPayment(payment, order) {
//     $.ajax({
//       url: "/verifypayment",
//       data: {
//         payment,
//         order,
//       },
//       method: "post",
//       success: (response) => {
//         if (response.success) {
//           console.log("succes");
//           location.href = "/ordersuccess";
//         } else {
//           console.log("fail");
//           location.href = "/cart";
//         }
//       },
//     });
//   }