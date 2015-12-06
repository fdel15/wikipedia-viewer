$(document).ready(function() {
  $('#go').click(pageSearch);
  $('#search-box').on('keyup', function(event) {
    keypress(event)
  });
  $('#random').click(randomSearch)
  $(document).on('click', '#dropdown a li', function(event) {
    event.preventDefault();
    var target = $(event.target);
    $('#search-box').val(target.text())
    pageSearch();
  })
});

function pageSearch() {
  var pages;
  var results = [];
  var search = $("#search-box").val();
  var url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=175&exintro=&explaintext=&generator=search&gsrsearch=" + search + "&format=json";

  if (search.length === 0) {
    return;
  }
  clearDropdown();
  $('.row').css('margin-top', '25px')
  $('.result').remove()

  $.ajax({
    dataType: "jsonp",
    url: url,
    headers: {
      'Api-User-Agent': 'frankdelpidio@gmail.com'
    },
    method: 'GET',
    success: function(data) {
      pages = data.query.pages
      for (var key in pages) {
        results.push(pages[key])
      }
    }
  }).done(function() {
    results.forEach(function(result) {
      result.url = "https://en.wikipedia.org/wiki/?curid=" + result.pageid
      if (result.extract) {
        displayResult(result);
      } else {
        getExtract(result)
      }
    })
  })
}

function getExtract(result) {
  var url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exchars=175&explaintext=&pageids=" + result.pageid;

  $.ajax({
    dataType: "jsonp",
    url: url,
    headers: {
      'Api-User-Agent': 'frankdelpidio@gmail.com'
    },
    method: 'GET',
    success: function(data) {
      result.extract = data.query.pages[result.pageid].extract;
      displayResult(result);
    }
  })
}

function randomSearch() {
  var pages;
  var url = "https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=10"

  clearDropdown();
  $('.row').css('margin-top', '25px');
  $('.result').remove();
  $('#search-box').val("")

  $.ajax({
      dataType: "jsonp",
      url: url,
      headers: {
        'Api-User-Agent': 'frankdelpidio@gmail.com'
      },
      method: 'GET',
      success: function(data) {
        pages = data.query.random
      }
    })
    .done(function() {
      pages.forEach(function(result) {
        result.url = "https://en.wikipedia.org/wiki/?curid=" + result.id
        result.pageid = result.id
        getExtract(result)
      })
    })
}

function dropdownMenu(search) {
  var url = "https://en.wikipedia.org/w/api.php?action=query&list=prefixsearch&format=json&pssearch=" + search + "&pslimit=10"

  $('#dropdown a li').remove()
  $('#dropdown').css('height', '75px')

  if (search.length === 0) {
    clearDropdown();
    return;
  }

  $.ajax({
    dataType: "jsonp",
    url: url,
    headers: {
      'Api-User-Agent': 'frankdelpidio@gmail.com'
    },
    method: 'GET',
    success: function(data) {
      var items = data.query.prefixsearch
      items.forEach(function(item) {
        displayDropdown(item)
      });
    }
  })
}

function keypress(event) {
  var search = $('#search-box').val()

  if (event.keyCode === 13) {
    pageSearch()
  } else {
    dropdownMenu(search)
  }
};

function clearDropdown() {
  $('#dropdown a li').remove()
  $('#dropdown').css('height', '0');
}

function displayResult(result) {
  $('.results').append(
    "<a href='" + result.url + "' target='_blank'>" +
    "<div class='result'>" +
    "<h4>" + result.title + "</h4>" +
    "<p>" + result.extract + "</p>" +
    "</div>" +
    "</a>"
  )
}

function displayDropdown(item) {
  $('#dropdown').append(
    "<a href='#'><li>" + item.title + "</li></a>"
  )
}