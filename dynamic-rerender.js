Fruits = new Meteor.Collection ('fruits');

if (Meteor.isClient) {
    Session.set ("fruitName", null);

    Session.get ("fruitName");
    Router.configure ({
        layoutTemplate:"layout",
        rootElement   :".layoutWrapper"
    });

    Router.map (
        function () {

            this.route ("home", {
                path      :"/",
                controller:"HomeController",
                action    :'showForm'
            });

        });

    HomeController = RouteController.extend ({
        template:"mainTpl",
        showForm:function () {
            this.render ();
            this.render ({
                childTpl:{to:"child"}
            });

        }
    });

    Template.fruitsTpl.fruits = function () {
        var fruitName = Session.get ("fruitName");
        return Fruits.find ({name:fruitName});
    };

    Template.fruitsTpl.events ({
        'click .mango':function () {
            Session.set ("fruitName", "Mango");
        },
        'click .apple':function () {
            Session.set ("fruitName", "Apple");
        }
    });

    Template.mainTpl.events ({
        'click .remove':function () {
            $(".dynamicContent").html("Content Replaced");
        },
        'click .add':function () {
            Session.set ("fruitName", null);
            $(".dynamicContent").html(Meteor.render(Template.childTpl()));
        }
    });



    App = {
        subscriptions:{
            fruits:Meteor.subscribe ("fruits")
        }
    };

}

if (Meteor.isServer) {
    Meteor.startup (function () {
        // code to run on server at startup
        var allFruits = ["Apple",
            "Banana",
            "Mango",
            "Kiwi",
            "Grape",
            "Plum"];

        if (Fruits.find ().count () === 0) {
            for (var i = 0; i < allFruits.length; i++) {
                Fruits.insert ({name:allFruits[i]});
            }
        }
    });

    Meteor.publish ('fruits', function (catID) {
        return Fruits.find ();
    });

}
