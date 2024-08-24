const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const cd = $('.cd')
const thumb = $('.cd-music')
const heading = $('h2')
const audio = $('#audio')
const playbtn = $('.btn-toggle')
const ui = $('.ui')
const progress = $('#progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const playlist = $('.playlist')
const h4 = $('h4')
const PLAYER_STORAGE = 'khanh'

const app = {
    currentIndex: 0,
    isplaying: false,
    isrepeat: false,
    israndom: false,
    contain: [],
    settings: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    song: [
        {
            name: 'Thắc mắc',
            author: 'Thịnh suy',
            path: 'music/thacmac.mp3',
            image: 'img/pic1.jpg'
        },
        {
            name: 'Bao tiền một mớ bình yên',
            author: '14 Casper',
            path: 'music/baotienmotmobinhyen.mp3',
            image: 'img/pic2.jpg'
        },
        {
            name: 'Ghé qua',
            author: 'Dick x Tofu x PC14Casper',
            path: 'music/ghequa.mp3',
            image: 'img/pic3.jpg'
        },
        {
            name: 'Tệ thật, anh nhớ em',
            author: 'Thanh Hưng',
            path: 'music/tethatanhnhoem.mp3',
            image: 'img/pic4.jpg'
        },
        {
            name: 'Hẹn em ở lần yêu 2',
            author: 'Nguyenn x Đặng Tuấn Vũ',
            path: 'music/henemolanyeu2.mp3',
            image: 'img/pic5.jpg'
        },
        {
            name: 'Vài câu nói khiến người khac thay đổi',
            author: 'GREY D x TLINH',
            path: 'music/vaicaunoicokhiennguoithaydoi.mp3',
            image: 'img/pic6.jpg'
        },
        {
            name: 'Chiều hôm ấy',
            author: 'JayKii',
            path: 'music/chieuhomay.mp3',
            image: 'img/pic7.jpg'
        },
        
       
    ],

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get() {
                return this.song[this.currentIndex]
            }
        })
    },
    
    
    render: function() {
        const html = this.song.map((song, index) => {
            return  `
            <div class="song ${index == this.currentIndex ? 'active': ''}" data-index=${index}>
            <div class="img" style="background-image: url('${song.image}')"></div>
            <div class="include">
            <div class="author">${song.author}</div>
            <div class="name-music">${song.name}</div>
            </div>
            <div class="options">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        })
        $('.playlist').innerHTML = html.join('\n')
    },
    
    handleEvent: function() {
        cdwidth = cd.offsetWidth
        const rotate = cd.animate([{transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })

        rotate.pause()
        
        document.onscroll = function() {
            const scroll = window.scrollY || document.documentElement.scrollTop
            const newTheSize = cdwidth - scroll
            cd.style.width = newTheSize > 0 ? newTheSize +'px' : 0
            cd.style.opacity = newTheSize / cdwidth
        }
        
        playbtn.onclick = function() {
           if (app.isplaying) {
            audio.pause()
            rotate.pause()
            
           } else {
            audio.play()
            rotate.play()
           }
        }

        audio.onplay = function() {
            app.isplaying = true
            ui.classList.add('playing')
            h4.innerHTML = 'Now playing'
            h4.classList.add('playing')
            app.render()
        }

        audio.onpause = function() {
            app.isplaying = false
            ui.classList.remove('playing')
            h4.innerHTML = 'Now stopping'
            h4.classList.remove('playing')
            app.render()
        
        }

        audio.ontimeupdate = function() {
            progress.value = audio.currentTime / audio.duration * 100
        }
        
        progress.oninput = function() {   
            audio.currentTime = audio.duration / 100 * progress.value       
        }
        
        next.onclick = function() {
            if (app.israndom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            rotate.play()
            app.render()
            app.scrollToView()
        }

        prev.onclick = function() {
            if (app.israndom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            rotate.play()
            app.render()
            app.scrollToView()
        }

        audio.onended = function() {
            if (app.isrepeat) {
                audio.play()
                rotate.cancel()
                rotate.play()
            } else {
                next.click()
            }
        }
        
        random.onclick = function() {
            app.israndom = !app.israndom
            random.classList.toggle('active')
            app.setConfig('israndom', app.israndom)
            
        }

        repeat.onclick = function() {
            app.isrepeat = !app.isrepeat
            repeat.classList.toggle('active')
            app.setConfig('isrepeat', app.isrepeat)
        }

        playlist.onclick = function(e) {
            const node = e.target.closest('.song:not(.active)')
            if (node || e.target.closest('.options') ) {
                if (node) {
                    app.currentIndex = node.dataset.index
                    app.render()
                    app.loadSong()
                    rotate.play()
                    audio.play()
                }

                if ((e.target.closest('.options'))) {
                    // do something here
                }
            }
        }
    },
     
    loadSong: function() {
        heading.textContent = this.currentSong.name
        thumb.style.backgroundImage =  `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex == this.song.length) {
            this.currentIndex = 0
        }
        this.loadSong(this.currentIndex)
    }, 

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length -1
        } 
        this.loadSong()
    },

    randomSong: function() {
        var a
        do {
             a = Math.floor(Math.random() * this.song.length)     
        } while (this.contain.includes(a)) 
        this.contain.push(a)
        if (this.contain.length === this.song.length) {
            this.contain = []
        }
        this.currentIndex = a
        this.loadSong()
    },

    scrollToView: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200);
    },

    setConfig: function(key, value) {
        this.settings[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.settings))
    },

    loadConfig: function() {
        this.israndom = this.settings.israndom
        this.isrepeat = this.settings.isrepeat
        if (this.isrepeat !== undefined) {

            repeat.classList.toggle('active', this.isrepeat)
        }
        if (this.israndom !== undefined) {

            random.classList.toggle('active', this.israndom)
        }
        if (this.israndom == undefined && this.isrepeat == undefined) {
           repeat.classList.remove('active')
           random.classList.remove('active')
        } 
    },

    start: function() {
        this.handleEvent()
        this.render()
        this.defineProperties()
        this.loadSong()
        this.loadConfig()
    }
    
}

app.start()















