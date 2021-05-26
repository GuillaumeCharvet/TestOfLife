var map = [];
var map_aux = [];

const num_l = 175;
const num_c = 200;
const size_l = 8;
const size_c = 8;

const lim_display_grid = 12;

var graphics;

var cursors;

var timing = 0;

var pause = true;
var pause_possible = false;

var color = 1;
var switch_color_possible = false;
var size_radius = 2;

var radius_up_possible = false;
var radius_down_possible = false;

class scene1 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene1");
        this.pad = null;
    }
    
    preload ()
    {   
    }
    
    create ()
    {
        graphics = this.add.graphics();
        
        cursors = this.input.keyboard.addKeys({ 'pause': Phaser.Input.Keyboard.KeyCodes.SPACE, 'switch_color': Phaser.Input.Keyboard.KeyCodes.C, 'radius_up': Phaser.Input.Keyboard.KeyCodes.P, 'radius_down': Phaser.Input.Keyboard.KeyCodes.M});
        
        for (let i = 0; i < num_l; i++)
        {
            map.push([]);
            map_aux.push([]);
            for (let j = 0; j < num_c; j++)
            {
                map[i].push(0);
                map_aux[i].push(0);
            }
        }
        
        /*map[0] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[1] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[2] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[3] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[4] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[5] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[6] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[7] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[8] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[9] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[10] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[11] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[16] = [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];*/

        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                map_aux[i][j] = map[i][j];
            }
        }
        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                if (map[i][j] == 0){graphics.fillStyle(0xffff00, 1);}
                else if (map[i][j] == 1){graphics.fillStyle(0xff00ff, 1);}
                
                if (size_c < lim_display_grid){graphics.fillRect(j*size_c,i*size_l,size_c,size_l);}
                else {graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);}
            }
        }
        
        /*this.input.on('pointerdown', function (pointer) {
            console.log('x = ',Math.floor(pointer.x/size_c),', y = ',Math.floor(pointer.y/size_l));
            map[Math.floor(pointer.y/size_l)][Math.floor(pointer.x/size_c)] = color;
            map_aux[Math.floor(pointer.y/size_l)][Math.floor(pointer.x/size_c)]  = color;
            if (color == 0){graphics.fillStyle(0xffff00, 1);}else{graphics.fillStyle(0xff00ff, 1);}
            graphics.fillRect(Math.floor(pointer.x/size_c)*size_c+1,Math.floor(pointer.y/size_l)*size_l+1,size_c-2,size_l-2);
        }, this); */
    }
    
    update ()
    {
        if (cursors.pause.isUp && pause_possible)
        {
            if (pause){pause = false;}
            else{pause = true;}
            pause_possible = false;
        }
        if (cursors.pause.isDown){pause_possible = true;}
        
        if (cursors.switch_color.isUp && switch_color_possible)
        {
            if (color == 1){color = 0;}
            else{color = 1;}
            switch_color_possible = false;
        }
        if (cursors.switch_color.isDown){switch_color_possible = true;}
        
        if (cursors.radius_up.isUp && radius_up_possible)
        {
            size_radius++;
            radius_up_possible = false;
        }
        if (cursors.radius_up.isDown){radius_up_possible = true;}
        
        if (cursors.radius_down.isUp && radius_down_possible)
        {
            if (size_radius!=0){size_radius--;}
            radius_down_possible = false;
        }
        if (cursors.radius_down.isDown){radius_down_possible = true;}
        
        if (this.input.activePointer.isDown && 0<game.input.mousePointer.y<config.height && 0<game.input.mousePointer.x<config.width)
        {
            var i = Math.floor(game.input.mousePointer.y/size_l);
            var j = Math.floor(game.input.mousePointer.x/size_c);
            for (let k = -size_radius; k <= size_radius; k++)
            {
                for (let l = -size_radius; l <= size_radius; l++)
                {
                    if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i+k && i+k<num_l && 0<=j+l && j+l<num_c)
                    {
                        map[i+k][j+l] = color;
                        map_aux[i+k][j+l]  = color;
                        if (color == 0){graphics.fillStyle(0xffff00, 1);}else{graphics.fillStyle(0xff00ff, 1);}
                        if (size_c < lim_display_grid){graphics.fillRect((j+l)*size_c,(i+k)*size_l,size_c,size_l);}
                        else {graphics.fillRect((j+l)*size_c+1,(i+k)*size_l+1,size_c-2,size_l-2);}
                    }
                }
            }
        }
        
        if (!pause)
        {
            if (timing == 0)
            {
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        //console.log("i =",i,"j =",j,"map[i][j] =",map[i][j]);
                        var compteur = 0;
                        for (let k = -1; k < 2; k++)
                        {
                            for (let l = -1; l < 2; l++)
                            {
                                var dep_ik = i+k;
                                var dep_jl = j+l;
                                if (dep_ik > num_l-1){dep_ik = 0}
                                else if (dep_ik < 0){dep_ik = num_l-1}
                                if (dep_jl > num_c-1){dep_jl = 0}
                                else if (dep_jl < 0){dep_jl = num_c-1}
                                //console.log("dep_ik =",dep_ik);
                                if ((k!=0 || l!=0) && map[dep_ik][dep_jl] == 1)
                                {
                                    compteur += 1;
                                }
                            }
                        }
                        //console.log(compteur);
                        if (compteur == 3)
                        {
                            map_aux[i][j] = 1;
                            if (map[i][j] == 0)
                            {
                                graphics.fillStyle(0xff00ff, 1);
                                if (size_c < lim_display_grid){graphics.fillRect(j*size_c,i*size_l,size_c,size_l);}
                                else {graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);}
                            }
                        }
                        else if (compteur > 3 || compteur < 2)
                        {
                            map_aux[i][j] = 0;
                            if (map[i][j] == 1)
                            {
                                graphics.fillStyle(0xffff00, 1);
                                if (size_c < lim_display_grid){graphics.fillRect(j*size_c,i*size_l,size_c,size_l);}
                                else {graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);}
                            }
                        }
                    }
                }

                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        map[i][j] = map_aux[i][j];
                    }
                }
            }
            timing = (timing+1)%5;
        }
        
    }
}