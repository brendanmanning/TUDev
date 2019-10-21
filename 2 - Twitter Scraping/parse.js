const fs = require('fs');
const rl = require('readline-sync')

function main() {

    let rep_records = get_rep_records();
    let dem_records = get_dem_records();

    console.log("Republican Engagement: " + rankEngagement(rep_records));
    console.log("Democrat Engagement: " + rankEngagement(dem_records));
    console.log();
    console.log("Republican Hashtags (at least 3 uses): ");
    console.dir(countHashtags(rep_records));
    console.log();
    console.log("Democrat Hashtags (at least 3 uses): ");
    console.dir(countHashtags(dem_records));
    console.log();

    while(true) {
    
        let search = rl.question("Search: ");

        if(!search || search == "quit") break;

        let r_mentions = countMentions(rep_records, search);
        let d_mentions = countMentions(dem_records, search);

        console.log(
            "\"" + search + "\" was mentioned: \n" +
            "  " + r_mentions + " times by Republicans\n" +
            "  " + d_mentions + " times by Democrats"
        );
    }
}

function countMentions(tweets, string) {
    let count = 0;
    string = string.toLowerCase().trim();
    for(let tweet of tweets) {
        let msg = tweet['tweet'].toLowerCase().trim();
        if(msg.includes(string)) {
            count++;
        }
    }
    return count;
}

function countHashtags(tweets) {
    let hashtags = {};
    for(let tweet of tweets) {
        for(let hashtag of tweet['hashtags']) {
            let ht = hashtag.toLowerCase();
            if(hashtags[ht] == undefined) {
                hashtags[ht] = 1;
            } else {
                hashtags[ht]++;
            }
        }
    }

    for(let key in hashtags) {
        if(hashtags[key] < 3) {
            delete hashtags[key];
        }
    }

    return hashtags;
}

function rankEngagement(tweets) {
    let likes = 0;
    let retweets = 0;
    for(let tweet of tweets) {
        likes += tweet['likes_count'];
        retweets += tweet['retweets_count'];
    }
    return (likes / retweets);
}

function get_rep_records() {
    return get_records("rep.json");
}

function get_dem_records() {
    return get_records("dem.json");
}

function get_records(file) {
    let content = fs.readFileSync(file).toString();
    let records = [];
    for(let line of content.split("\n")) {
        try {
            records.push(JSON.parse(line));
        } catch (e) {}
    }
    return records;
}

main();