<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<%@ taglib prefix="snk" uri="/WEB-INF/tld/sankhyaUtil.tld" %>

<html lang="pt-BR">
<head>
    <snk:load />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.cdnfonts.com/css/helvetica-neue-5?styles=103510,103508" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300&display=swap" rel="stylesheet">
    <title>Sankhya-Om com React</title>
</head>
<body>
    <div id="root"></div>
    <script src="${BASE_FOLDER}bundle.js" async defer></script>
    <script>
        window.onload = function() {
            var parentDoc = window.parent.document;

            var buttonToRemove = parentDoc.querySelector('.gwt-Button.chartConfigButton');
            if (buttonToRemove) {
                buttonToRemove.remove();
            }

            var topBar = parentDoc.querySelector('.DashWindow-TopBar');
            if (topBar) {
                topBar.remove();
            }

            var sideBar = parentDoc.querySelector('.GI-BUHVBCWC');
            if (sideBar) {
                sideBar.remove();
            }

            var raizElement = parentDoc.querySelector('.raiz');
            if (raizElement) {
                raizElement.style.width = '100%';
                raizElement.style.height = '100%';
            }

            var hiddenElement1 = parentDoc.querySelector('div[aria-hidden="true"][style*="position: absolute"][style*="z-index: -32767"]');
            if (hiddenElement1) {
            hiddenElement1.remove();
            }

            // Seleciona e remove o segundo elemento
            var hiddenElement2 = parentDoc.querySelector('div[style*="position: absolute"][style*="overflow: hidden"][style*="height: 27px"]');
            if (hiddenElement2) {
            hiddenElement2.remove();
            }

            // Seleciona e remove o terceiro elemento
            var hiddenElement3 = parentDoc.querySelector('div.GI-BUHVBPVC');
            if (hiddenElement3) {
                hiddenElement3.style.display = 'contents';
            }


            var dashWindow = parentDoc.querySelector('.dashWindow-size');
            if (dashWindow) {
                dashWindow.style.width = '100%';
                dashWindow.style.height = '100%';
            }

            var element = parentDoc.querySelector('div[style*="position: absolute"][style*="overflow: hidden"][style*="inset: 27px 0px 0px;"]');
            if (element) {
                element.style.top = '0px';
                element.style.left = '0px';
                element.style.right = '0px';
                element.style.bottom = '0px';
            }

        };


    </script>
</body>
</html>