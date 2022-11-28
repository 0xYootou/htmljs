module.exports = 
  randomItem:(arr,num)->
    if num
      arr.sort ()->
        return Math.random() - 0.5
      return arr.slice(0, num)
    else
      l = arr.length
      return arr[Math.floor(Math.random()*l)]