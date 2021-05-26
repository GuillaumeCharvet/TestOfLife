var map = [];
var map_aux = [];

const num_l = 120;
const num_c = 200;
const size_l = 8;
const size_c = 8;

const lim_display_grid = 12;

var graphics;
var scoreText;
var reserveText;
var reserveText2;
var scoreFinalText;

var cursors;

var timing = 0;

var pause = true;
var pause_possible = false;

var color = 1;
var switch_color_possible = false;
var size_radius = 2;
var reserve_mouse = 180;
var reserve_mouse2 = 5;

var mouse_possible = false;
var radius_up_possible = false;
var radius_down_possible = false;

var random_start = true;
var compteur_cases_non_vides;

var scoreMax = 0;
var nb_tour_var_max_max = 100;
var nb_tour_var_max;

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
        
        scoreText = this.add.text(16, 16,"", {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            fill: '#000000'
        });
        
        reserveText= this.add.text(config.width - 330, 16,"reserve longueur clic = "+reserve_mouse, {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            fill: '#000000'
        });
        
        reserveText2= this.add.text(config.width - 330, 36,"reserve nombre clic = "+reserve_mouse2, {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            fill: '#000000'
        });
        
        cursors = this.input.keyboard.addKeys({ 'pause': Phaser.Input.Keyboard.KeyCodes.SPACE, 'switch_color': Phaser.Input.Keyboard.KeyCodes.C, 'radius_up': Phaser.Input.Keyboard.KeyCodes.P, 'radius_down': Phaser.Input.Keyboard.KeyCodes.M, 'trait_droit': Phaser.Input.Keyboard.KeyCodes.ALT});
        
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
        
        if (random_start)
        {
            var nb_trait = 9+Math.floor(5*Math.random());
            for (let n = 0; n < nb_trait; n++)
            {
                var x_start = Math.floor(config.width*Math.random());
                var y_start = Math.floor(config.height*Math.random());
                var theta = 2*Math.PI*Math.random();
                var length_trait = 3+Math.floor(28*Math.random());
                for (let p = 0; p < length_trait; p++)
                {
                    var i = Math.floor(y_start/size_l);
                    var j = Math.floor(x_start/size_c);
                    for (let k = -size_radius; k <= size_radius; k++)
                    {
                        for (let l = -size_radius; l <= size_radius; l++)
                        {
                            if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i+k && i+k<num_l && 0<=j+l && j+l<num_c)
                            {
                                map[i+k][j+l] = color;
                                map_aux[i+k][j+l]  = color;
                                draw(color,(j+l)*size_c,(i+k)*size_l,size_c,size_l);
                            }
                        }
                    }
                    var d = 2+Math.floor((6*size_radius+1)*Math.random());
                    x_start += d*Math.cos(theta);
                    y_start += d*Math.sin(theta);
                    theta += 2*Math.PI/8*Math.random()-Math.PI/8;
                    if(p%3==0){size_radius = Math.min(Math.max(size_radius + Math.floor(3*Math.random())-1,0),5);}
                }
            }
        }
        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                map_aux[i][j] = map[i][j];
                draw(map[i][j],j*size_c,i*size_l,size_c,size_l);
            }
        }
        size_radius = 2;        
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
        
        /*if (cursors.radius_up.isUp && radius_up_possible)
        {
            size_radius++;
            radius_up_possible = false;
        }
        if (cursors.radius_up.isDown){radius_up_possible = true;}*/
        
        if (cursors.radius_down.isUp && radius_down_possible)
        {
            if (size_radius!=0){size_radius--;}
            radius_down_possible = false;
        }
        if (cursors.radius_down.isDown){radius_down_possible = true;}
        
        if (this.input.activePointer.isDown && 0<game.input.mousePointer.y<config.height && 0<game.input.mousePointer.x<config.width && reserve_mouse>0 && reserve_mouse2>0)
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
                        draw(color,(j+l)*size_c,(i+k)*size_l,size_c,size_l);
                    }
                }
            }
            reserve_mouse--;
            reserveText.setText("reserve longueur clic = "+reserve_mouse);
            mouse_possible =true;
        }
        
        if (mouse_possible && !this.input.activePointer.isDown)
        {
            reserve_mouse2--;
            reserveText2.setText("reserve nombre clic = "+reserve_mouse2);
            mouse_possible = false;
        }
        
        if (!pause)
        {
            if (timing == 0)
            {
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        /*
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
                                if ((k!=0 || l!=0) && map[dep_ik][dep_jl] == 1)
                                {
                                    compteur += 1;
                                }
                            }
                        }
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
                        }*/
                        
                        //Comptage des voisins
                        var compteur1 = 0;
                        var compteur2 = 0;
                        var compteur3 = 0;
                        var compteur4 = 0;
                        var compteur5 = 0;
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
                                if (k!=0 || l!=0)
                                {
                                    if (map[dep_ik][dep_jl] == 1){compteur1 += 1;}
                                    else if (map[dep_ik][dep_jl] == 2){compteur2 += 1;}
                                    else if (map[dep_ik][dep_jl] == 3){compteur3 += 1;}
                                    else if (map[dep_ik][dep_jl] == 4){compteur4 += 1;}
                                    else if (map[dep_ik][dep_jl] >= 5){compteur5 += 1;}
                                }
                            }
                        }
                        
                        //Regles d'evolution
                        if (map[i][j] == 0)
                        {
                            if (compteur1 == 3 || compteur1+compteur2+compteur3+compteur4 > 6)
                            {
                                map_aux[i][j] += 1;
                            }
                        }
                        else if (map[i][j] == 1)
                        {
                            
                            if (compteur5 >= 3)
                            {
                                map_aux[i][j] = 5;
                            }
                            else if (compteur1 == 5 || compteur1 == 4)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2 < 3 || compteur1+compteur2 >5)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 2)
                        {
                            if (compteur5 >= 2)
                            {
                                map_aux[i][j] = 5;
                            }
                            else if (compteur1+compteur2 > 6)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2 < 5)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 3)
                        {
                            if (compteur5 >= 1)
                            {
                                map_aux[i][j] = 5;
                            }
                            else if (compteur1+compteur2+compteur3 > 7)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2+compteur3 < 3)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 4)
                        {
                            if (compteur5 >= 1)
                            {
                                map_aux[i][j] = 5;
                            }
                            if (compteur4 == 2 && compteur3 == 2)
                            {
                                map_aux[i][j] = 5;
                            }
                            else if (compteur3+compteur2 < 3)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if ( 5 <= map[i][j] && map[i][j] < 21)
                        {
                            map_aux[i][j] += 1;
                        }
                        else if (map[i][j] == 21)
                        {
                            map_aux[i][j] = 0;
                        }
                        
                        //Affichage si changement
                        if (map[i][j] != map_aux[i][j]){draw(map_aux[i][j],j*size_c,i*size_l,size_c,size_l);}
                        
                    }
                }

                compteur_cases_non_vides = 0;
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        if(map_aux[i][j]!=0){compteur_cases_non_vides++}
                        map[i][j] = map_aux[i][j];
                    }
                }
                if(scoreMax<compteur_cases_non_vides)
                {
                    scoreMax = compteur_cases_non_vides;
                    nb_tour_var_max = nb_tour_var_max_max;
                }
                else
                {
                    nb_tour_var_max--;
                }
                
                if(nb_tour_var_max<=0)
                {
                    pause=true;
                    scoreText.setVisible(false);
                    scoreFinalText = this.add.text(config.width/2-650, config.height/2-80,"Score max = "+scoreMax, {
                        fontSize: '120px',
                        padding: { x: 10, y: 5 },
                        fill: '#000000'
                    });
                }
                
                scoreText.setFontSize(18+Math.floor(compteur_cases_non_vides/30));
                scoreText.setText(compteur_cases_non_vides);
            }
            timing = (timing+1)%5;
        }
        
    }
}

function draw(color,x,y,lx,ly)
{
    if (color == 0){graphics.fillStyle(0xf2e2e2, 1);}
    else if (color == 1){graphics.fillStyle(0xff00ff, 1);}
    else if (color == 2){graphics.fillStyle(0xcf00ff, 1);}
    else if (color == 3){graphics.fillStyle(0xaf00ff, 1);}
    else if (color == 4){graphics.fillStyle(0x8f00ff, 1);}
    else if (color == 5){graphics.fillStyle(0x00ff00, 1);}
    else if (color == 6){graphics.fillStyle(0x30ff30, 1);}
    else if (color == 7){graphics.fillStyle(0x60ff60, 1);}
    else if (color == 8){graphics.fillStyle(0x90ff90, 1);}
    else                {graphics.fillStyle(0x90ff90, 1);}
    
    if (size_c < lim_display_grid){graphics.fillRect(x,y,lx,ly);}
    else {graphics.fillRect(x+1,y+1,lx-2,ly-2);}
}